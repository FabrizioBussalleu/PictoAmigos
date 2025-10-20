import { motion } from "framer-motion";
import { MessageCircle, Users, Accessibility } from "lucide-react";

const PillarsSection = () => {
  return (
    <section id="pilares" className="features-section">
      <div className="project-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="project-header"
        >
          <h2 className="section-title">Nuestros Pilares</h2>
          <p className="section-subtitle">
            Los valores que guían nuestro desarrollo
          </p>
        </motion.div>

        <div className="features-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="feature-card"
            whileHover={{
              y: -10,
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <MessageCircle size={32} />
              </div>
              <div className="feature-icon-bg"></div>
            </div>
            <div className="feature-content">
              <h3>Comunicación Natural</h3>
              <p>
                Integra texto, voz y pictogramas para facilitar la expresión y
                comprensión en entornos educativos.
              </p>
              <div className="feature-highlight"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="feature-card"
            whileHover={{
              y: -10,
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <Accessibility size={32} />
              </div>
              <div className="feature-icon-bg"></div>
            </div>
            <div className="feature-content">
              <h3>Totalmente Inclusivo</h3>
              <p>
                Diseñado específicamente para niños con dificultades
                comunicativas, siguiendo estándares WCAG.
              </p>
              <div className="feature-highlight"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="feature-card"
            whileHover={{
              y: -10,
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <div className="feature-icon-bg"></div>
            </div>
            <div className="feature-content">
              <h3>Conecta Comunidades</h3>
              <p>
                Facilita la colaboración entre docentes, terapeutas y familias
                para mejor apoyo educativo.
              </p>
              <div className="feature-highlight"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
