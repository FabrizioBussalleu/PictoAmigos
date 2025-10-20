import { useState, FormEvent } from "react";

interface RegisterScreenProps {
  onShowScreen: (screen: "welcome" | "login") => void;
}

const RegisterScreen = ({ onShowScreen }: RegisterScreenProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username) newErrors.username = "El nombre de usuario es obligatorio.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Por favor, introduce un correo válido.";

    if (password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userExists = users.some((user: any) => user.email === email);

        if (userExists) {
          setErrors({ ...errors, email: "Este correo electrónico ya está registrado." });
          setIsLoading(false);
          return;
        }

        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        setIsLoading(false);
        onShowScreen("login");

      } catch (err) {
        setErrors({ form: "Ocurrió un error al crear la cuenta. Inténtalo de nuevo." });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="screen welcome-screen active flex items-center justify-center">
      <button className="back-btn" onClick={() => onShowScreen("welcome")}>
        <i className="fas fa-arrow-left"></i>
      </button>

      <div className="form-container">
        <div className="form-header">
          <span className="header-icon"><i className="fas fa-user-plus" style={{ color: '#8A2BE2', fontSize: '2.5rem' }}></i></span>
          <h2>¡Únete a PictoAmigos!</h2>
          <p>Crea tu cuenta para empezar a divertirte</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`input-group ${errors.username ? 'error' : ''}`}>
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escribe tu nombre de usuario"
              required
            />
            <div className="input-error-text">{errors.username}</div>
          </div>

          <div className={`input-group ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
            <div className="input-error-text">{errors.email}</div>
          </div>

          <div className={`input-group ${errors.password ? 'error' : ''}`}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <div className="input-error-text">{errors.password}</div>
          </div>

          {errors.form && <div className="input-error-text" style={{textAlign: 'center', marginBottom: '1rem'}}>{errors.form}</div>}

          <div style={{textAlign: 'center'}}>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loader"></span> : <span>¡Crear mi cuenta!</span>}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>
            ¿Ya tienes cuenta?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onShowScreen("login"); }}>
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
