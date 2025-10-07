import { Building2, HeartPulse, School, Landmark, Factory, ShoppingBag } from 'lucide-react';

export default function UseCases() {
  const cases = [
    {
      icon: Building2,
      title: 'Empresas Corporativas',
      description: 'Control de acceso por departamento, gestión de visitantes y optimización de espacios de trabajo',
      examples: ['Oficinas multinivel', 'Coworking', 'Centros de negocios']
    },
    {
      icon: HeartPulse,
      title: 'Centros de Salud',
      description: 'Monitoreo de personal médico, control de áreas críticas y gestión de flujo de pacientes',
      examples: ['Hospitales', 'Clínicas', 'Laboratorios']
    },
    {
      icon: School,
      title: 'Instituciones Educativas',
      description: 'Seguridad estudiantil, control de personal docente y gestión de instalaciones',
      examples: ['Universidades', 'Colegios', 'Institutos']
    },
    {
      icon: Landmark,
      title: 'Entidades Públicas',
      description: 'Trazabilidad de funcionarios, control de áreas restringidas y cumplimiento normativo',
      examples: ['Municipalidades', 'Ministerios', 'Oficinas gubernamentales']
    },
    {
      icon: Factory,
      title: 'Industria y Manufactura',
      description: 'Seguridad en plantas, control de turnos y acceso a zonas de producción',
      examples: ['Fábricas', 'Plantas', 'Almacenes']
    },
    {
      icon: ShoppingBag,
      title: 'Retail y Comercio',
      description: 'Gestión de personal en tiendas, control de inventario y análisis de afluencia',
      examples: ['Centros comerciales', 'Tiendas', 'Cadenas retail']
    }
  ];

  return (
    <section id="use-cases" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Sectores de Aplicación
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Performa se adapta a las necesidades específicas de múltiples industrias y organizaciones
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((useCase, idx) => (
            <div
              key={idx}
              className="group bg-gradient-card p-8 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-2xl transition-all duration-300 hover:scale-105 transform animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-glow">
                  <useCase.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:translate-x-1 transition-transform duration-300">
                  {useCase.title}
                </h3>
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed">
                {useCase.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {useCase.examples.map((example, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm rounded-full border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 transform"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="inline-block bg-gradient-primary p-8 md:p-12 rounded-2xl text-white shadow-glow hover:shadow-glow-lg transition-all duration-500">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Tienes un caso de uso específico?
            </h3>
            <p className="text-lg text-blue-50 mb-6 max-w-2xl">
              Nuestro equipo puede personalizar Performa para adaptarse a las necesidades únicas de tu organización
            </p>
            <button className="px-8 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 transform shadow-lg">
              Solicita una Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
