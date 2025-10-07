import { ArrowRight, Shield, Cpu } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      {/* Animated Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-down">
          <div className="p-3 bg-primary/20 rounded-xl backdrop-blur-sm border border-primary/30 transition-transform hover:scale-110 duration-300">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Innova<span className="text-primary">Track</span>
          </h1>
          <div className="p-3 bg-primary/20 rounded-xl backdrop-blur-sm border border-primary/30 transition-transform hover:scale-110 duration-300">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Main Tagline */}
        <p className="text-xl md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Soluciones inteligentes para la gestión de personal y control de aforo en tiempo real
        </p>

        {/* Subtitle */}
        <p className="text-lg text-blue-200/80 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Transformamos espacios empresariales con tecnología de identificación selectiva,
          biometría avanzada e inteligencia artificial
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => scrollToSection('performa')}
            className="group px-8 py-4 bg-primary hover:bg-primary-light text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-glow hover:shadow-glow-lg hover:scale-105 transform"
          >
            Conoce Performa
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          <button
            onClick={() => scrollToSection('contact')}
            className="px-8 py-4 glass text-white rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 border-white/40 hover:scale-105 transform"
          >
            Contáctanos
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Shield, title: 'Seguridad Reforzada', desc: 'Control de acceso inteligente', delay: '0.5s' },
            { icon: Cpu, title: 'IA Avanzada', desc: 'Identificación en tiempo real', delay: '0.6s' },
            { icon: Shield, title: 'Trazabilidad Total', desc: 'Reportes detallados', delay: '0.7s' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 glass rounded-xl hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-glow animate-fade-in-up"
              style={{ animationDelay: item.delay }}
            >
              <item.icon className="w-10 h-10 text-primary mb-4 mx-auto transition-transform group-hover:scale-110 duration-300" />
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-blue-200/70 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
