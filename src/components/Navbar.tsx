import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { id: 'about', title: 'Nosotros' },
    { id: 'performa', title: 'Producto' },
    { id: 'benefits', title: 'Beneficios' },
    { id: 'use-cases', title: 'Casos de Uso' },
    { id: 'team', title: 'Equipo' },
    { id: 'contact', title: 'Contacto' }
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-slate-900/90 backdrop-blur-xl shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 animate-fade-in">
            <a 
              href="#" 
              onClick={() => scrollToSection('hero')} 
              className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-300 inline-block"
            >
              Innova<span className="text-primary gradient-text">Track</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, idx) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={e => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                className="text-blue-100 hover:text-primary transition-all duration-300 font-medium relative group animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {link.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="bg-slate-900/95 backdrop-blur-xl pb-4 border-t border-white/10">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link, idx) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={e => {
                  e.preventDefault();
                  scrollToSection(link.id);
                }}
                className="text-blue-100 hover:text-primary transition-all duration-300 font-medium w-full text-center py-2 hover:bg-white/5 rounded-lg animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {link.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
