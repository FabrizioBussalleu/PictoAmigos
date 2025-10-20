import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import ProjectSection from "./components/ProjectSection";
import AboutUs from "./components/AboutUs";
import WelcomeScreen from "./components/WelcomeScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import MainScreen from "./components/MainScreen";
import Footer from "./components/Footer";
import PillarsSection from "./components/PillarsSection";

type Screen = "landing" | "welcome" | "login" | "register" | "main";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [userName, setUserName] = useState<string>("");

  const showScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleNavigate = (screen: "landing" | "welcome" | "login" | "register" | "main") => {
    setCurrentScreen(screen);
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    setCurrentScreen("main");
  };

  const handleLogout = () => {
    setUserName("");
    setCurrentScreen("landing");
  };

  return (
    <div className="app-container">
      {currentScreen === "landing" && (
        <div className="landing-wrapper">
          <LandingPage onNavigate={handleNavigate} />
          <PillarsSection />
          <ProjectSection onNavigate={handleNavigate} />
          <AboutUs />
          <Footer />
        </div>
      )}
      {currentScreen === "welcome" && <WelcomeScreen onShowScreen={handleNavigate} />}
      {currentScreen === "login" && <LoginScreen onShowScreen={showScreen} onLogin={handleLogin} />}
      {currentScreen === "register" && <RegisterScreen onShowScreen={showScreen} />}
      {currentScreen === "main" && <MainScreen userName={userName} onLogout={handleLogout} />}
    </div>
  );
}

export default App;