import { Mail, MapPin, Phone, Send, Linkedin, Github, Twitter } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Hablemos de tu Proyecto
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            ¿Listo para transformar la gestión de tu organización? Contáctanos y descubre cómo Performa puede ayudarte
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="animate-slide-in-left">
            <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                <div className="p-3 bg-primary/20 rounded-lg group-hover:shadow-glow transition-all duration-300">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Email</p>
                  <a href="mailto:contacto@innovatrack.pe" className="text-blue-200 hover:text-primary transition-colors">
                    contacto@innovatrack.pe
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                <div className="p-3 bg-primary/20 rounded-lg group-hover:shadow-glow transition-all duration-300">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Teléfono</p>
                  <a href="tel:+51999999999" className="text-blue-200 hover:text-primary transition-colors">
                    +51 999 999 999
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group hover:translate-x-2 transition-transform duration-300">
                <div className="p-3 bg-primary/20 rounded-lg group-hover:shadow-glow transition-all duration-300">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Ubicación</p>
                  <p className="text-blue-200">
                    Universidad Peruana de Ciencias Aplicadas<br />
                    Lima, Perú
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-3 glass hover:bg-primary/20 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-glow transform"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="p-3 glass hover:bg-primary/20 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-glow transform"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="p-3 glass hover:bg-primary/20 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-glow transform"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl transition-all duration-300 hover:bg-white/15">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-white placeholder-blue-200/50"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-white placeholder-blue-200/50"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="company" className="block text-sm font-semibold mb-2">
                  Empresa u Organización
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-white placeholder-blue-200/50"
                  placeholder="Nombre de tu empresa"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-semibold mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300 text-white placeholder-blue-200/50 resize-none"
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 transform shadow-glow hover:shadow-glow-lg"
              >
                Enviar Mensaje
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
