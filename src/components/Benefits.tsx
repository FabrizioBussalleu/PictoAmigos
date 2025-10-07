import { TrendingUp, Shield, FileCheck, BarChart, Zap, Lock } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Mayor Eficiencia',
      description: 'Optimiza la gestión de personal con datos precisos y automatización inteligente',
      stats: '40% menos tiempo',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Seguridad Reforzada',
      description: 'Control de acceso jerárquico y verificación multi-factor en tiempo real',
      stats: '99.9% precisión',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FileCheck,
      title: 'Trazabilidad Total',
      description: 'Cumplimiento normativo garantizado con registros detallados y auditorías',
      stats: '100% auditable',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart,
      title: 'Datos en Tiempo Real',
      description: 'Dashboards interactivos y métricas actualizadas para decisiones estratégicas',
      stats: 'Insights inmediatos',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full mb-4 font-semibold">
            <Zap className="w-5 h-5" />
            Beneficios
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Ventajas Competitivas
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Performa transforma la manera en que las organizaciones gestionan su personal y espacios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="group relative bg-white p-8 rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:scale-105 transform animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 bg-gradient-to-br ${benefit.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-glow`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className={`px-3 py-1 bg-gradient-to-r ${benefit.gradient} text-white text-sm font-bold rounded-full animate-pulse`}>
                    {benefit.stats}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {benefit.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Lock, text: 'Control Jerárquico Inteligente' },
            { icon: Zap, text: 'Implementación Rápida' },
            { icon: BarChart, text: 'Escalable y Flexible' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-6 bg-gradient-card rounded-xl border border-slate-200 hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105 transform animate-fade-in-up"
              style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
            >
              <item.icon className="w-8 h-8 text-primary" />
              <span className="font-semibold text-slate-900">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
