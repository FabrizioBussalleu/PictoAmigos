import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProblemSolution from './components/ProblemSolution';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import UseCases from './components/UseCases';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <motion.section id="hero" variants={sectionVariants} initial="hidden" animate="visible">
        <Hero />
      </motion.section>
      <motion.section id="about" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <About />
      </motion.section>
      <motion.section id="problem-solution" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <ProblemSolution />
      </motion.section>
      <motion.section id="performa" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <HowItWorks />
      </motion.section>
      <motion.section id="benefits" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Benefits />
      </motion.section>
      <motion.section id="use-cases" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <UseCases />
      </motion.section>
      <motion.section id="team" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Team />
      </motion.section>
      <motion.section id="contact" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Contact />
      </motion.section>
      <Footer />
    </div>
  );
}

export default App;
