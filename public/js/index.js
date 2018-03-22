var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    alert('Disconected from server');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    var li = $('<li>', { text : `${message.from}: ${message.text}` });

    $("#messages").append(li);
});

socket.on('newLocationMessage', function(message){
    var li = $('<li>', { text: `${message.from}: `});
    var a = $('<a>', { href: message.url, target: '_blank', text: 'My current location'});
    li.append(a);
});

socket.emit('createMessage', {
    from: 'Frank',
    text: 'Hi'
}, function (data) {
    console.log('Got it',data);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: "User",
        text: $('[name=message]').val()
    }, function () {
        
    });
});

var locationButton = $("#send-location");

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        alert('Unable to fetch location');
    },{maximumAge:60000, timeout:5000, enableHighAccuracy:true});
});