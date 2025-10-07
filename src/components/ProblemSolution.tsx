import { AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

export default function ProblemSolution() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full mb-6 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              El Problema
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Los sistemas tradicionales no distinguen
            </h2>
            <div className="space-y-4">
              {[
                'No diferencian entre empleados y visitantes',
                'Generan imprecisiones en conteo de aforo',
                'Carecen de control jerárquico por cargo o rango',
                'Presentan riesgos operativos y de seguridad',
                'No ofrecen trazabilidad en tiempo real'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse" />
                  <p className="text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slide-in-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-6 font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              La Solución
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Performa: Identificación Inteligente
            </h2>
            <div className="space-y-4">
              {[
                'Identifica y distingue personal autorizado en tiempo real',
                'Control jerárquico: muestra cargo y rango de cada persona',
                'Conteo selectivo con alta precisión',
                'Alertas automáticas al alcanzar límites de aforo',
                'Reportes detallados y trazabilidad completa'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }} />
                  <p className="text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20" />
          <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-2xl hover:shadow-glow transition-all duration-500 hover:scale-[1.02] transform">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
              <h3 className="text-2xl font-bold text-slate-900">Valor Diferencial</h3>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              <span className="font-semibold gradient-text">Performa</span> no es solo un sistema de control de acceso.
              Es una plataforma inteligente que combina <span className="font-semibold">biometría avanzada</span> (huella,
              rostro, iris), <span className="font-semibold">códigos QR dinámicos</span>, credenciales electrónicas,
              UWB/geofencing y <span className="font-semibold">visión por IA</span> para ofrecer control jerárquico
              inteligente, conteo selectivo de personal y monitoreo en tiempo real que realmente transforma la gestión
              organizacional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
