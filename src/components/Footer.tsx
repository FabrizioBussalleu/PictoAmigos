import { motion } from "framer-motion";
import { Github, FileText, Heart, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      icon: <Github size={20} />,
      label: "Repositorio",
      url: "https://github.com/FabrizioBussalleu/TP-IA",
      description: "Ver código fuente"
    },
    {
      icon: <FileText size={20} />,
      label: "Documentación",
      url: "https://docs.google.com/document/d/1gKi4hMgrKok2wQ-YcH30-kNCMwG3nnHHQKGHUPwKlrQ/edit?usp=sharing",
      description: "Leer documentación del proyecto"
    }
  ];

  return (
    <footer id="contacto" className="footer">
      <div className="footer-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="footer-content"
        >
          {/* Logo y descripción */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Heart className="footer-heart" />
              <span className="footer-title">PictoAmigos</span>
            </div>
            <p className="footer-description">
              Comunicación inclusiva a través de pictogramas. 
              Conectando comunidades y facilitando la expresión para todos.
            </p>
          </div>

          {/* Enlaces del proyecto */}
          <div className="footer-links">
            <h3 className="footer-section-title">Proyecto</h3>
            <div className="footer-link-list">
              {footerLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link-simple"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="footer-contact">
            <h3 className="footer-section-title">Contacto</h3>
            <div className="contact-info">
              {[
                "u202211490@upc.edu.pe",
                "u202315655@upc.edu.pe",
                "u202310373@upc.edu.pe",
                "u202311894@upc.edu.pe",
                "u202311788@upc.edu.pe",
              ].map((email) => (
                <div className="contact-item" key={email}>
                  <Mail size={18} />
                  <span>{email}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Línea divisoria y copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="footer-bottom"
        >
          <div className="footer-divider"></div>
          <div className="footer-copyright">
            <p>&copy; 2024 PictoAmigos. Todos los derechos reservados.</p>
            <p>Proyecto académico - Universidad Tecnológica Nacional</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
