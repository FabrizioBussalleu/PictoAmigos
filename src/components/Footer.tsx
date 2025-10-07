import { Shield, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 animate-fade-in">
              <Shield className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold">
                Innova<span className="text-primary">Track</span>
              </span>
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Startup tecnológica de estudiantes de la UPC dedicada a desarrollar soluciones inteligentes
              para la gestión de personal y control de aforo en tiempo real.
            </p>
            <p className="text-sm text-slate-500">
              Universidad Peruana de Ciencias Aplicadas
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#performa" className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block">
                  Performa
                </a>
              </li>
              <li>
                <a href="#performa" className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block">
                  Características
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block">
                  Casos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block">
                  Precios
                </a>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#about" className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block">
                  Equipo
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors duration-300 hover:translate-x-1 inline-block">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2025 InnovaTrack. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
