import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
      nombre: "Jorge Garcia",
      rol: "u202211490",
      descripcion: "Estudiante de la Universidad Peruana de Ciencias Aplicadas",
      image: "/integrantes/jorge.jpg",
      github: "#",
      linkedin: "#"
    },
    {
      nombre: "Fabrizio Bussalleu",
      rol: "u202315655",
      descripcion: "Estudiante de la Universidad Peruana de Ciencias Aplicadas",
      image: "/integrantes/fabrizio.jpg",
      github: "https://github.com/FabrizioBussalleu",
      linkedin: "https://www.linkedin.com/in/fabrizio-bussalleu-salcedo-237760323"
    },
    {
      nombre: "Victor Carranza",
      rol: "u202310373",
      descripcion: "Estudiante de la Universidad Peruana de Ciencias Aplicadas",
      image: "/integrantes/victor.jpg",
      github: "#",
      linkedin: "#"
    },
    {
      nombre: "Jose Villanueva",
      rol: "u202311894",
      descripcion: "Estudiante de la Universidad Peruana de Ciencias Aplicadas",
      image: "/integrantes/jose.jpg",
      github: "#",
      linkedin: "#"
    },
    {
      nombre: "Aldo Zavala",
      rol: "u202311788",
      descripcion: "Estudiante de la Universidad Peruana de Ciencias Aplicadas",
      image: "/integrantes/aldo.png",
      github: "#",
      linkedin: "#"
    }
  ];

  return (
    <section id="nosotros" className="about-section">
      <div className="about-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="about-header"
        >
          <h2 className="section-title">Conoce al Equipo</h2>
          <p className="section-subtitle">
            Las mentes detrás de PictoAmigos
          </p>
        </motion.div>

        <div className="team-rows-container">
          <div className="team-row">
            {teamMembers.slice(0, 3).map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="team-card"
              >
                <div className="team-card-inner">
                  <div className="member-avatar">
                    <img src={member.image} alt={member.nombre} className="avatar-image" />
                    <div className="avatar-ring"></div>
                  </div>
                  <h3 className="member-name">{member.nombre}</h3>
                  <p className="member-role">{member.rol}</p>
                  <p className="member-description">{member.descripcion}</p>
                  
                  <div className="member-socials">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                      <Github size={18} />
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                      <Linkedin size={18} />
                    </a>
                    <a href={`mailto:${member.rol}@upc.edu.pe`} className="social-btn" aria-label="Email">
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="team-row">
            {teamMembers.slice(3, 5).map((member, index) => (
              <motion.div
                key={index + 3}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: (index + 3) * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="team-card"
              >
                <div className="team-card-inner">
                  <div className="member-avatar">
                    <img src={member.image} alt={member.nombre} className="avatar-image" />
                    <div className="avatar-ring"></div>
                  </div>
                  <h3 className="member-name">{member.nombre}</h3>
                  <p className="member-role">{member.rol}</p>
                  <p className="member-description">{member.descripcion}</p>
                  
                  <div className="member-socials">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="GitHub">
                      <Github size={18} />
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="LinkedIn">
                      <Linkedin size={18} />
                    </a>
                    <a href={`mailto:${member.rol}@upc.edu.pe`} className="social-btn" aria-label="Email">
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;