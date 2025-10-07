import { Users, Github, Linkedin, Mail } from 'lucide-react';

export default function Team() {
  const team = [
    {
      name: 'Eduardo Alexander Gorbeña Vargas',
      role: 'Co-Fundador & Desarrollador',
      description: 'Estudiante de Ingeniería de Software. Experto en C++, Python, HTML, Assembler, Java y C#',
      image: '/assets/Eduardo Alexander Gorbena Vargas.jpg',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Benjamin Elias Bardales Rodriguez',
      role: 'Co-Fundador & Desarrollador',
      description: 'Estudiante de Ingeniería de Software. Perseverante y comprometido con el aprendizaje continuo',
      image: '/assets/Benjamin Elias Bardales Rodriguez.jpg',
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      name: 'Fabrizio Bussalleu Salcedo',
      role: 'Co-Fundador & Desarrollador',
      description: 'Estudiante de Ciencias de la Computación. Experiencia en Python, C++, JavaScript, SQL y desarrollo web',
      image: '/assets/Fabrizio Bussalleu Salcedo.jpg',
      gradient: 'from-teal-500 to-green-500'
    },
    {
      name: 'Diego Alexander Cabrejos',
      role: 'Alias Motox & Desarrollador',
      description: 'Me gustan las computadoras y los videojuegos.',
      image: '/assets/Diego Alexander Cabrejos Chocco.jpg',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Axel Mirko Quibajo Vilca',
      role: 'Co-Fundador & UX Designer',
      description: 'Estudiante de Ciencias de la Computación. Enfocado en la experiencia de usuario y comunicación efectiva',
      image: '/assets/Axel Mirko Quibajo Vilca.png',
      gradient: 'from-emerald-500 to-cyan-600'
    },
    {
      name: 'José Díaz',
      role: 'Co-Fundador & Desarrollador',
      description: 'Estudiante de Ciencias de la Computación. Conocimientos en C++, JS, Python, y edición multimedia',
      image: '/assets/Jose Andres Diaz Orihuela.jpg',
      gradient: 'from-cyan-600 to-blue-600'
    }
  ];

  return (
    <section id="team" className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4 font-semibold">
            <Users className="w-5 h-5" />
            Equipo Fundador
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Conoce al Equipo
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Estudiantes apasionados de la UPC unidos por la visión de transformar la gestión empresarial con tecnología
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:scale-105 transform animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${member.gradient}`} />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:translate-x-1 transition-transform duration-300">
                  {member.name}
                </h3>
                <p className={`text-sm font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-3`}>
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {member.description}
                </p>

                <div className="flex gap-3">
                  <button className="p-2 bg-slate-100 hover:bg-gradient-primary hover:text-white rounded-lg transition-all duration-300 hover:scale-110 transform shadow-sm hover:shadow-glow">
                    <Github className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-slate-100 hover:bg-gradient-primary hover:text-white rounded-lg transition-all duration-300 hover:scale-110 transform shadow-sm hover:shadow-glow">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-slate-100 hover:bg-gradient-primary hover:text-white rounded-lg transition-all duration-300 hover:scale-110 transform shadow-sm hover:shadow-glow">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="inline-block bg-gradient-hero p-8 md:p-12 rounded-2xl text-white shadow-glow hover:shadow-glow-lg transition-all duration-500">
            <Users className="w-12 h-12 mx-auto mb-4 animate-bounce-subtle" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Únete a Nuestro Equipo
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Estamos en constante crecimiento. Si eres estudiante de la UPC apasionado por la tecnología,
              contáctanos para formar parte de InnovaTrack
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
