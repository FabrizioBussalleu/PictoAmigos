import { motion } from "framer-motion";
import { Target, Globe, Database, Brain, TrendingUp, Award, Lightbulb, Users2 } from "lucide-react";

interface ProjectSectionProps {
  onNavigate: (screen: "welcome") => void;
}

const ProjectSection = ({ onNavigate }: ProjectSectionProps) => {
  const projectBlocks = [
    {
      icon: <Target size={32} />,
      title: "Nuestra Misión",
      content: "PictoAmigos es un asistente conversacional inclusivo diseñado para niños con dificultades comunicativas. Integra texto, voz y pictogramas para facilitar la expresión y comprensión en entornos educativos.",
      background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
    },
    {
      icon: <Globe size={32} />,
      title: "Impacto Global",
      content: "Contribuye a los ODS 4 (Educación de calidad), ODS 9 (Innovación e infraestructura) y ODS 10 (Reducción de desigualdades). Nuestra tecnología impulsa la inclusión educativa a nivel mundial.",
      background: "linear-gradient(135deg, #c084fc 0%, #9333ea 100%)"
    },
    {
      icon: <Brain size={32} />,
      title: "Contexto Educativo",
      content: "La Inteligencia Artificial ha transformado la educación inclusiva, ayudando a niños con dificultades del habla o escritura. PictoAmigos combina NLP y pictogramas para apoyar a docentes, terapeutas y familias.",
      background: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)"
    },
    {
      icon: <Database size={32} />,
      title: "Tecnología Avanzada",
      content: "Utilizamos un dataset sintético con más de 500,000 frases infantiles, asociación de texto y pictogramas mediante la API de ARASAAC, y modelos de NLP en español como BETO y DistilBETO.",
      background: "linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Enfoques Innovadores",
      content: "Combinamos métodos clásicos y de aprendizaje profundo para ofrecer la mejor experiencia posible. Nuestros algoritmos mejoran continuamente gracias al feedback de usuarios reales.",
      background: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)"
    },
    {
      icon: <Award size={32} />,
      title: "Meta Principal",
      content: "Demostrar que la IA puede ser una aliada de la inclusión educativa, reduciendo barreras comunicativas y fomentando la accesibilidad para todos los niños sin excepción.",
      background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
    }
  ];

  return (
    <section id="proyecto" className="project-section">
      <div className="project-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="project-header"
        >
          <h2 className="section-title">Sobre el Proyecto</h2>
          <p className="section-subtitle">
            Tecnología e innovación al servicio de la educación inclusiva
          </p>
        </motion.div>

        <div className="project-blocks">
          {projectBlocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="project-block"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <div className="project-block-header">
                <div className="project-icon" style={{ background: block.background }}>
                  {block.icon}
                </div>
                <div className="project-block-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
              <div className="project-block-content">
                <h3>{block.title}</h3>
                <p>{block.content}</p>
              </div>
              <div className="project-block-decoration"></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="project-cta"
        >
          <div className="cta-card">
            <h3>¿Listo para revolucionar la comunicación inclusiva?</h3>
            <p>Únete a nuestra comunidad y sé parte del cambio</p>
            <button className="btn-cta" onClick={() => onNavigate("welcome")}>
              Comenzar ahora
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectSection;