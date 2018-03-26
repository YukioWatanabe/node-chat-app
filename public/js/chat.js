var socket = io();

function scrollToBottom(){
    var messages = $("#messages");
    var newMessage = messages.children('li:last-child');

    var scrollHeight = messages.prop('scrollHeight');

    var shouldScrollHeight = 0;
    shouldScrollHeight += messages.prop('clientHeight');
    shouldScrollHeight += messages.prop('scrollTop');
    shouldScrollHeight += newMessage.innerHeight();
    shouldScrollHeight += newMessage.prev().innerHeight();

    if(shouldScrollHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var params = $.deparam(window.location.search);

    socket.emit('join',params, function(err){
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error.');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconected from server');
});

socket.on('updateUserList', function(users) {
    var ol = $('<ol>');

    users.forEach(function (user) {
        ol.append($('<li>', {text : user}));
    });

    $('#users').html(ol);
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $("#message-template").html();
    var html = Mustache.render(template, { 
        text: message.text, 
        from: message.from, 
        createdAt: formattedTime
    });
    
    $("#messages").append(html);

    scrollToBottom();
});

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $("#location-message-template").html();
    var html = Mustache.render(template, { 
        url: message.url, 
        from: message.from, 
        createdAt: formattedTime
    });

    $("#messages").append(html);

    scrollToBottom();
});

var messageTextbox = $("[name=message]");

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: "User",
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val("");
    });
});

var locationButton = $("#send-location");

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled','disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');

        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');

        alert('Unable to fetch location');
    },{maximumAge:60000, timeout:5000, enableHighAccuracy:true});
});