const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var users;

    var user1 = {
        id: '1',
        name: 'Fulano 1',
        room: 'Node Course'
    };

    var user2 = {
        id: '2',
        name: 'Fulano 2',
        room: 'React Course'
    };

    var user3 = {
        id: '3',
        name: 'Fulano 3',
        room: 'Node Course'
    };

    beforeEach(() => {
        users = new Users();

        users.users = [user1,user2,user3];
    });


    it('should add new user', () => {
        var users = new Users();

        var user = {
            id: '123',
            name: 'Fulano',
            room: 'The Potatoes Devouers'
        };

        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var userId = '1';
        
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users).toEqual([user2,user3]);
    });

    it('should NOT remove a user', () => {
        var user = users.removeUser('9999');
        
        expect(user).toNotExist();
        expect(users.users).toEqual([user1,user2,user3]);
    });

    it('should find a user', () => {
        var user = users.getUser('1');

        expect(user).toEqual(user1);
    });

    it('should NOT find a user', () => {
        var user = users.getUser('9999');

        expect(user).toNotExist();
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');

        expect(userList).toEqual(['Fulano 1','Fulano 3']);
    });
    
    it('should return names for react course', () => {
        var userList = users.getUserList('React Course');

        expect(userList).toEqual(['Fulano 2']);
    });
});