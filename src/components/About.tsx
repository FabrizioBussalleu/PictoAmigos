import { Target, Eye, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 animate-fade-in-up">
            Sobre Nosotros
          </h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full animate-scale-in" />
        </div>

        <div className="max-w-4xl mx-auto mb-16 text-center">
          <p className="text-lg text-slate-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="font-semibold text-slate-900">InnovaTrack</span> es una startup tecnológica formada por
            estudiantes de ingeniería y ciencias de la computación de la{' '}
            <span className="font-semibold gradient-text">Universidad Peruana de Ciencias Aplicadas (UPC)</span>.
            Nos dedicamos a desarrollar soluciones tecnológicas inteligentes para optimizar la gestión de personal
            y control de aforo en tiempo real dentro de organizaciones.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="group bg-gradient-card p-8 rounded-2xl border border-slate-200 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:scale-105 transform animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Misión</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Desarrollar soluciones inteligentes basadas en sensores de conteo selectivo para mejorar la
              administración de espacios empresariales e institucionales. Transformamos la gestión de aforo
              interno, garantizando un control confiable y eficiente que contribuya a entornos más organizados,
              seguros y modernos.
            </p>
          </div>

          <div className="group bg-gradient-card p-8 rounded-2xl border border-slate-200 hover:border-secondary transition-all duration-500 hover:shadow-2xl hover:scale-105 transform animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-glow">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Visión</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Ser referentes globales en tecnologías inteligentes para el control selectivo de personal,
              reconocidos por la innovación, confiabilidad y el impacto positivo en la eficiencia organizacional.
              Aspiramos a liderar la transformación digital en la gestión de espacios corporativos.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-gradient-primary rounded-2xl p-8 md:p-12 text-white text-center shadow-glow hover:shadow-glow-lg transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Innovación desde la Universidad
          </h3>
          <p className="text-lg text-blue-50 max-w-3xl mx-auto">
            Combinamos conocimiento académico de vanguardia con pasión por la tecnología para crear
            soluciones que marcan la diferencia en el mundo empresarial e institucional.
          </p>
        </div>
      </div>
    </section>
  );
}
