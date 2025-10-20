import { useState } from "react";
import ChatArea from "./ChatArea";
import FriendsList from "./FriendsList";

interface MainScreenProps {
  userName: string;
  onLogout: () => void;
}

const MainScreen = ({ userName, onLogout }: MainScreenProps) => {
  const [selectedFriend, setSelectedFriend] = useState("Ana");

  return (
    <div className="screen active">
      <div className="main-layout">
        <header className="main-header">
          <div className="header-left">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <h3>¡Hola, {userName}!</h3>
              <span className="status online">En línea</span>
            </div>
          </div>
          <div className="header-center">
            <h1>PictoAmigos</h1>
          </div>
          <div className="header-right">
            <button className="btn-icon" onClick={() => alert("Notificaciones")}>
              <i className="fas fa-bell"></i>
              <span className="notification-dot"></span>
            </button>
            <button className="btn-icon" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </header>

        <div className="chat-container">
          <FriendsList selectedFriend={selectedFriend} onSelectFriend={setSelectedFriend} />
          <ChatArea friendName={selectedFriend} />
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
