interface WelcomeScreenProps {
  onShowScreen: (screen: "login" | "register" | "landing") => void;
}

const WelcomeScreen = ({ onShowScreen }: WelcomeScreenProps) => {
  return (
    <div className="screen welcome-screen active">
      <button className="back-btn" onClick={() => onShowScreen("landing")}>
        <i className="fas fa-arrow-left"></i>
      </button>
      <div className="welcome-content">
        <div className="logo-container">
          <div className="logo-circle">
            <div className="chat-bubbles">
              <div className="bubble bubble-1"></div>
              <div className="bubble bubble-2"></div>
            </div>
          </div>
          <h1 className="app-title">PictoAmigos</h1>
          <p className="app-subtitle">¡Tu red social de pictogramas favorita!</p>
        </div>
        
        <div className="floating-icons">
          <div className="floating-icon star" style={{ "--delay": "0s" } as React.CSSProperties}>🌟</div>
          <div className="floating-icon butterfly" style={{ "--delay": "1s" } as React.CSSProperties}>🦋</div>
          <div className="floating-icon balloon" style={{ "--delay": "2s" } as React.CSSProperties}>🎈</div>
          <div className="floating-icon palette" style={{ "--delay": "3s" } as React.CSSProperties}>🎨</div>
          <div className="floating-icon rainbow" style={{ "--delay": "4s" } as React.CSSProperties}>🌈</div>
          <div className="floating-icon rocket" style={{ "--delay": "5s" } as React.CSSProperties}>🚀</div>
          <div className="floating-icon heart" style={{ "--delay": "6s" } as React.CSSProperties}>💖</div>
          <div className="floating-icon sun" style={{ "--delay": "7s" } as React.CSSProperties}>☀️</div>
        </div>

        <div className="welcome-buttons">
          <button className="btn btn-primary" onClick={() => onShowScreen("login")}>
            <span>→ Iniciar Sesión</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onShowScreen("register")}>
            <span>+ Crear Cuenta</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
