class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);

        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }

    once(event, callback) {
        const wrappedCallback = (data) => {
            callback(data);
            this.off(event, wrappedCallback);
        };
        this.on(event, wrappedCallback);
    }
}

class AppState {
    constructor() {
        this.events = new EventEmitter();
        this.state = {
            currentUser: null,
            currentFriend: 'Ana',
            messages: {
                'Ana': [
                    {
                        type: 'received',
                        content: '¡Hola! ¿Cómo estás?',
                        time: '10:30 AM',
                        avatar: '🌸'
                    },
                    {
                        type: 'sent',
                        content: '¡Muy bien! ¿Y tú?',
                        time: '10:32 AM'
                    },
                    {
                        type: 'received',
                        content: '¡Es mi cumpleaños!',
                        time: '10:35 AM',
                        avatar: '🌸',
                        pictograms: '🎈🎉🎂'
                    }
                ],
                'Carlos': [
                    {
                        type: 'received',
                        content: '¿Jugamos?',
                        time: '09:15 AM',
                        avatar: '🚀'
                    }
                ],
                'María': [
                    {
                        type: 'received',
                        content: 'Mira este pictograma...',
                        time: 'Ayer',
                        avatar: '🦄',
                        pictograms: '🌈✨'
                    }
                ]
            },
            friendsData: {
                'Ana': {
                    avatar: '🌸',
                    status: 'online',
                    lastMessage: '¡Hola! ¿Cómo estás?'
                },
                'Carlos': {
                    avatar: '🚀',
                    status: 'online',
                    lastMessage: '¿Jugamos?'
                },
                'María': {
                    avatar: '🦄',
                    status: 'offline',
                    lastMessage: 'Mira este pictograma...'
                }
            }
        };
    }

    getCurrentUser() {
        return this.state.currentUser;
    }

    setCurrentUser(user) {
        this.state.currentUser = user;
        this.events.emit('userChanged', user);
    }

    getCurrentFriend() {
        return this.state.currentFriend;
    }

    setCurrentFriend(friendName) {
        this.state.currentFriend = friendName;
        this.events.emit('friendChanged', friendName);
    }

    getFriendData(friendName) {
        return this.state.friendsData[friendName];
    }

    getAllFriends() {
        return this.state.friendsData;
    }

    getMessages(friendName) {
        return this.state.messages[friendName] || [];
    }

    addMessage(friendName, message) {
        if (!this.state.messages[friendName]) {
            this.state.messages[friendName] = [];
        }
        this.state.messages[friendName].push(message);
        this.events.emit('messageAdded', { friendName, message });
    }

    updateFriendLastMessage(friendName, message) {
        if (this.state.friendsData[friendName]) {
            this.state.friendsData[friendName].lastMessage = message;
        }
    }

    subscribe(event, callback) {
        return this.events.on(event, callback);
    }

    publish(event, data) {
        this.events.emit(event, data);
    }
}

export const appState = new AppState();
