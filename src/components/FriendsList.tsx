interface Friend {
  name: string;
  avatar: string;
  lastMessage: string;
  online: boolean;
}

interface FriendsListProps {
  selectedFriend: string;
  onSelectFriend: (name: string) => void;
}

const friends: Friend[] = [
  { name: "Ana", avatar: "🌸", lastMessage: "¡Hola! ¿Cómo estás?", online: true },
  { name: "Carlos", avatar: "🚀", lastMessage: "¿Jugamos?", online: true },
  { name: "María", avatar: "🦄", lastMessage: "Mira este pictograma...", online: false },
];

const FriendsList = ({ selectedFriend, onSelectFriend }: FriendsListProps) => {
  return (
    <div className="friends-list">
      <h3>
        <i className="fas fa-users"></i>
        Mis Amigos
      </h3>
      <div className="friends-list-content">
        {friends.map((friend) => (
          <div
            key={friend.name}
            className={`friend-item ${selectedFriend === friend.name ? "active" : ""}`}
            onClick={() => onSelectFriend(friend.name)}
          >
            <div className="friend-avatar">{friend.avatar}</div>
            <div className="friend-info">
              <h4>{friend.name}</h4>
              <p>{friend.lastMessage}</p>
            </div>
            <div className={`friend-status ${friend.online ? "online" : "offline"}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
