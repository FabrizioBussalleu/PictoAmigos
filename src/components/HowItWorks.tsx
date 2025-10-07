import { Fingerprint, Scan, Radio, Brain, BarChart3, Bell } from 'lucide-react';

export default function HowItWorks() {
  const features = [
    {
      icon: Fingerprint,
      title: 'Biometría Avanzada',
      desc: 'Reconocimiento de huella, rostro e iris para identificación precisa',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Scan,
      title: 'QR Dinámicos',
      desc: 'Códigos seguros y renovables para acceso temporal controlado',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      icon: Radio,
      title: 'UWB & Geofencing',
      desc: 'Localización precisa y control de zonas en tiempo real',
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: Brain,
      title: 'IA & Visión',
      desc: 'Algoritmos inteligentes para reconocimiento y análisis automático',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Reportes Detallados',
      desc: 'Datos precisos y métricas en tiempo real para decisiones estratégicas',
      color: 'from-emerald-500 to-cyan-600'
    },
    {
      icon: Bell,
      title: 'Alertas Inteligentes',
      desc: 'Notificaciones automáticas al alcanzar límites de aforo por área',
      color: 'from-cyan-600 to-blue-600'
    }
  ];

  return (
    <section id="performa" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full mb-4 font-semibold">
            <Brain className="w-5 h-5" />
            Producto Principal
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Cómo Funciona <span className="text-cyan-600">Performa</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Una plataforma integral que combina múltiples tecnologías de vanguardia para ofrecer
            control total sobre la gestión de personal y aforo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-gradient-card p-8 rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up hover:scale-105 transform"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className="relative">
                <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-hero rounded-2xl p-12 text-center text-white relative overflow-hidden shadow-glow hover:shadow-glow-lg transition-all duration-500">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4 animate-fade-in-up">
              Todo en una Sola Plataforma
            </h3>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Performa integra todas estas tecnologías en un sistema coherente y fácil de usar,
              con límites configurables por puesto, alertas automáticas y dashboards en tiempo real
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Biometría', 'QR', 'IA', 'UWB', 'Reportes', 'Alertas'].map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 glass rounded-full border-white/20 text-sm font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-110 transform animate-scale-in"
                  style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
