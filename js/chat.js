import { appState } from './state.js';
import { showNotification, safeVibrate, getCurrentTime } from './dom.js';

export class ChatModule {
    constructor() {
        this.setupEventListeners();
        this.setupStateSubscriptions();
    }

    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.sendMessage();
                }
            });

            messageInput.addEventListener('input', () => {
                this.updateTypingStatus(messageInput.value.length > 0);
            });
        }
    }

    setupStateSubscriptions() {
        appState.subscribe('friendChanged', (friendName) => {
            this.loadMessages(friendName);
            this.updateChatHeader(friendName);
        });

        appState.subscribe('messageAdded', ({ friendName, message }) => {
            if (friendName === appState.getCurrentFriend()) {
                this.displayMessage(message);
            }
        });

        appState.subscribe('screenChanged', (screenId) => {
            if (screenId === 'mainScreen') {
                this.initializeMainScreen();
            }
        });
    }

    initializeMainScreen() {
        const friendsList = document.getElementById('friendsList');
        if (friendsList) {
            this.loadFriendsList();
        }

        this.loadMessages(appState.getCurrentFriend());

        const chatArea = document.querySelector('.chat-area');
        if (chatArea) {
            chatArea.style.display = 'flex';
        }
    }

    loadFriendsList() {
        const friendsList = document.getElementById('friendsList');
        if (!friendsList) return;

        const currentFriend = appState.getCurrentFriend();
        const existingItems = friendsList.querySelectorAll('.friend-item');

        if (existingItems.length > 0) {
            existingItems.forEach(item => {
                const nameElement = item.querySelector('h4');
                if (nameElement && nameElement.textContent === currentFriend) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            return;
        }

        friendsList.innerHTML = '';
        const allFriends = appState.getAllFriends();

        Object.keys(allFriends).forEach((friendName) => {
            const friendData = allFriends[friendName];
            const isActive = friendName === currentFriend ? 'active' : '';

            const friendElement = document.createElement('div');
            friendElement.className = `friend-item ${isActive}`;
            friendElement.onclick = () => this.selectFriend(friendName);

            friendElement.innerHTML = `
                <div class="friend-avatar">${friendData.avatar}</div>
                <div class="friend-info">
                    <h4>${friendName}</h4>
                    <p>${friendData.lastMessage}</p>
                </div>
                <div class="friend-status ${friendData.status}"></div>
            `;

            friendsList.appendChild(friendElement);
        });
    }

    selectFriend(friendName) {
        appState.setCurrentFriend(friendName);

        const friendItems = document.querySelectorAll('.friend-item');
        friendItems.forEach(item => {
            item.classList.remove('active');
            const nameElement = item.querySelector('h4');
            if (nameElement && nameElement.textContent === friendName) {
                item.classList.add('active');
            }
        });

        safeVibrate(30);
        appState.publish('friendSelected', friendName);
    }

    updateChatHeader(friendName) {
        const friendData = appState.getFriendData(friendName);
        if (!friendData) return;

        const chatFriendName = document.getElementById('chatFriendName');
        const chatFriendAvatar = document.querySelector('.chat-friend-avatar');
        const chatFriendStatus = document.querySelector('.chat-friend-status');

        if (chatFriendName) chatFriendName.textContent = friendName;
        if (chatFriendAvatar) chatFriendAvatar.textContent = friendData.avatar;
        if (chatFriendStatus) {
            chatFriendStatus.textContent = friendData.status === 'online' ? 'En línea' : 'Desconectado';
        }
    }

    loadMessages(friendName) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        chatMessages.innerHTML = '';

        const friendMessages = appState.getMessages(friendName);

        friendMessages.forEach((message, index) => {
            setTimeout(() => {
                const messageElement = this.createMessageElement(message);
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, index * 100);
        });
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;

        let messageHTML = '';

        if (message.type === 'received') {
            messageHTML += `<div class="message-avatar">${message.avatar}</div>`;
        }

        messageHTML += `<div class="message-content">`;

        if (message.pictogramUrls && message.pictogramUrls.length > 0) {
            messageHTML += `<div class="real-pictograms">`;
            message.pictogramUrls.forEach(url => {
                messageHTML += `<img src="${url}" alt="pictograma" class="pictogram-img" loading="lazy" />`;
            });
            messageHTML += `</div>`;
        }

        if (message.pictograms) {
            messageHTML += `<div class="pictogram-message">${message.pictograms}</div>`;
        }

        messageHTML += `<p>${message.content}</p>`;
        messageHTML += `<span class="message-time">${message.time}</span>`;
        messageHTML += `</div>`;

        messageDiv.innerHTML = messageHTML;
        return messageDiv;
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const messageText = messageInput.value.trim();

        if (!messageText) {
            showNotification('Escribe un mensaje antes de enviar', 'warning');
            return;
        }

        const currentFriend = appState.getCurrentFriend();
        const newMessage = {
            type: 'sent',
            content: messageText,
            time: getCurrentTime()
        };

        appState.addMessage(currentFriend, newMessage);

        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        setTimeout(() => {
            this.autoSearchPictograms(messageText);
        }, 1000);

        messageInput.value = '';

        appState.publish('messageSent', { friendName: currentFriend, message: newMessage });

        setTimeout(() => {
            this.simulateAutoReply();
        }, 1000 + Math.random() * 2000);

        safeVibrate([50, 30, 50]);
    }

    addPictogram(pictogram) {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value += pictogram;
            messageInput.focus();
        }

        safeVibrate(25);
    }

    simulateAutoReply() {
        const autoReplies = [
            '¡Qué divertido! 😊',
            '¡Me encanta! ✨',
            '¡Genial! 🎉',
            '¿En serio? 😮',
            '¡Ja ja ja! 😄',
            '¡Súper! 🌟',
            '¡Wow! 🤩',
            '¡Increíble! 🚀'
        ];

        const currentFriend = appState.getCurrentFriend();
        const friendData = appState.getFriendData(currentFriend);

        if (friendData.status === 'online') {
            const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

            const autoMessage = {
                type: 'received',
                content: randomReply,
                time: getCurrentTime(),
                avatar: friendData.avatar
            };

            appState.addMessage(currentFriend, autoMessage);

            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            showNotification(`${currentFriend} te ha enviado un mensaje`, 'info');
        }
    }

    autoSearchPictograms(text) {
        const pictogramWords = [
            'hola', 'adios', 'casa', 'comida', 'agua', 'feliz', 'triste',
            'si', 'no', 'gracias', 'por favor', 'amor', 'familia', 'escuela',
            'jugar', 'dormir', 'comer', 'beber', 'correr', 'caminar'
        ];

        const words = text.toLowerCase().split(' ');
        const foundWords = words.filter(word =>
            pictogramWords.includes(word.replace(/[.,!?;]/g, ''))
        );

        if (foundWords.length > 0) {
            this.showPictogramSuggestion(foundWords[0]);
        }
    }

    showPictogramSuggestion(word) {
        const lastSuggestion = localStorage.getItem('lastPictogramSuggestion');
        const now = Date.now();

        if (!lastSuggestion || now - parseInt(lastSuggestion) > 30000) {
            const suggestion = document.createElement('div');
            suggestion.className = 'pictogram-suggestion-toast';
            suggestion.innerHTML = `
                <div class="suggestion-content">
                    <i class="fas fa-lightbulb"></i>
                    <span>¿Quieres agregar un pictograma para "${word}"?</span>
                    <button onclick="window.openPictogramSelector(); this.parentElement.parentElement.remove();">
                        <i class="fas fa-images"></i>
                    </button>
                    <button onclick="this.parentElement.parentElement.remove();">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            suggestion.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                animation: suggestionSlideIn 0.5s ease;
                max-width: 300px;
            `;

            document.body.appendChild(suggestion);

            setTimeout(() => {
                if (suggestion.parentElement) {
                    suggestion.style.animation = 'suggestionSlideOut 0.3s ease forwards';
                    setTimeout(() => suggestion.remove(), 300);
                }
            }, 5000);

            localStorage.setItem('lastPictogramSuggestion', now.toString());
        }
    }

    updateTypingStatus(isTyping) {
        const chatFriendStatus = document.querySelector('.chat-friend-status');
        const currentFriend = appState.getCurrentFriend();
        const friendData = appState.getFriendData(currentFriend);

        if (chatFriendStatus) {
            if (isTyping) {
                chatFriendStatus.textContent = 'Escribiendo...';
                chatFriendStatus.style.color = '#FF6B9D';
            } else {
                chatFriendStatus.textContent = friendData.status === 'online' ? 'En línea' : 'Desconectado';
                chatFriendStatus.style.color = '#6BCF7F';
            }
        }
    }

    showNotifications() {
        showNotification('¡Tienes 3 mensajes nuevos!', 'info');
    }
}

export function initializeChat() {
    return new ChatModule();
}
