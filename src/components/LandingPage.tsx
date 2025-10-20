import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, MessageCircle, Users, Accessibility, Home, BookOpen, Users2, LogIn, Gem, Mail } from "lucide-react";
import { useState, useEffect } from "react";

interface LandingPageProps {
  onNavigate: (screen: "landing" | "welcome" | "login" | "register" | "main") => void;
}

const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Transformaciones para la navbar
  const headerHeight = useTransform(scrollY, [0, 200], [80, 60]);
  const headerBg = useTransform(scrollY, [0, 200], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.85)"]);
  const headerShadow = useTransform(scrollY, [0, 200], ["none", "0 8px 32px rgba(0,0,0,0.1)"]);
  const headerBlur = useTransform(scrollY, [0, 200], [0, 20]);
  const headerBorderRadius = useTransform(scrollY, [0, 200], [0, 30]);
  const headerPadding = useTransform(scrollY, [0, 200], [0, 20]);
  const logoScale = useTransform(scrollY, [0, 200], [1, 0.85]);
  const navOpacity = useTransform(scrollY, [0, 200], [1, 1]);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 150);
    });
    return unsubscribe;
  }, [scrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      {/* Header Sticky con Morphing */}
      <motion.header 
        className={`landing-header ${isScrolled ? 'header-morphed' : 'header-normal'}`}
        style={{
          height: headerHeight,
          backgroundColor: headerBg,
          boxShadow: headerShadow,
          backdropFilter: `blur(${headerBlur.get()}px)`,
          borderRadius: headerBorderRadius,
          paddingLeft: headerPadding,
          paddingRight: headerPadding,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-container">
          <div className="header-left" style={{display: 'flex', alignItems: 'center'}}>
            <motion.div 
              className="logo-header"
              style={{ scale: logoScale }}
            >
              <Sparkles className="logo-icon" />
              <span className="logo-text">PictoAmigos</span>
            </motion.div>
            
            <motion.nav 
              className={`nav-menu ${isScrolled ? 'nav-morphed' : 'nav-normal'}`}
              style={{ opacity: navOpacity }}
            >
              <button onClick={() => scrollToSection("inicio")} className="nav-link">
                <Home size={18} />
                <span className="nav-text">Inicio</span>
              </button>
              <button onClick={() => scrollToSection("pilares")} className="nav-link">
                <Gem size={18} />
                <span className="nav-text">Valores</span>
              </button>
              <button onClick={() => scrollToSection("proyecto")} className="nav-link">
                <BookOpen size={18} />
                <span className="nav-text">Proyecto</span>
              </button>
              <button onClick={() => scrollToSection("nosotros")} className="nav-link">
                <Users2 size={18} />
                <span className="nav-text">Nosotros</span>
              </button>
              <button onClick={() => scrollToSection("contacto")} className="nav-link">
                <Mail size={18} />
                <span className="nav-text">Contáctanos</span>
              </button>
            </motion.nav>
          </div>
          
          {!isScrolled && (
            <div className="login-container">
              <motion.button 
                onClick={() => onNavigate("welcome")} 
                className="btn-login"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <LogIn size={18} />
                <span className="btn-text">Acceder</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section id="inicio" className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="hero-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Accessibility className="badge-icon" />
            <span>Comunicación Inclusiva</span>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Conecta con todos
            <br />
            <span className="gradient-text">a través de pictogramas</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Un asistente conversacional inclusivo que ayuda a niños con dificultades 
            comunicativas a expresarse mediante texto, voz y pictogramas.
          </motion.p>

          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <button onClick={() => onNavigate("welcome")} className="btn-hero-primary">
              <MessageCircle size={20} />
              Probar ahora
            </button>
            <button onClick={() => scrollToSection("proyecto")} className="btn-hero-secondary">
              Conocer más
            </button>
          </motion.div>
        </motion.div>

        {/* Animated Pictograms */}
        <div className="floating-pictograms">
          <motion.div 
            className="pictogram-float" 
            style={{ top: "10%", left: "15%" }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            😊
          </motion.div>
          <motion.div 
            className="pictogram-float" 
            style={{ top: "20%", right: "20%" }}
            animate={{ y: [0, -30, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
          >
            🎨
          </motion.div>
          <motion.div 
            className="pictogram-float" 
            style={{ bottom: "25%", left: "10%" }}
            animate={{ y: [0, -25, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
          >
            🌈
          </motion.div>
          <motion.div 
            className="pictogram-float" 
            style={{ bottom: "15%", right: "15%" }}
            animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, delay: 1.5 }}
          >
            ⭐
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;