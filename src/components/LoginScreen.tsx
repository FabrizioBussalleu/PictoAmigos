import { useState, FormEvent } from "react";

interface LoginScreenProps {
  onShowScreen: (screen: "welcome" | "register") => void;
  onLogin: (name: string) => void;
}

const LoginScreen = ({ onShowScreen, onLogin }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Por favor, introduce un correo válido.";
    if (!password) newErrors.password = "La contraseña es obligatoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    // Simulate API call
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((user: any) => user.email === email);

        if (!user) {
          setErrors({ form: "No se encontró ninguna cuenta con ese correo." });
          setIsLoading(false);
          return;
        }

        if (user.password !== password) {
          setErrors({ form: "La contraseña es incorrecta." });
          setIsLoading(false);
          return;
        }

        // Success
        onLogin(user.username);

      } catch (err) {
        setErrors({ form: "Ocurrió un error al iniciar sesión." });
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
          <span className="header-icon"><i className="fas fa-sign-in-alt" style={{ color: '#8A2BE2', fontSize: '2.5rem' }}></i></span>
          <h2>¡Bienvenido de vuelta!</h2>
          <p>Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`input-group ${errors.email ? 'error' : ''}`}>
            <label htmlFor="loginEmail">Correo electrónico</label>
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
            <div className="input-error-text">{errors.email}</div>
          </div>

          <div className={`input-group ${errors.password ? 'error' : ''}`}>
            <label htmlFor="loginPassword">Contraseña</label>
            <input
              type="password"
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
            />
            <div className="input-error-text">{errors.password}</div>
          </div>

          {errors.form && <div className="input-error-text" style={{textAlign: 'center', marginBottom: '1rem'}}>{errors.form}</div>}

          <div style={{textAlign: 'center'}}>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loader"></span> : <span>¡Entrar!</span>}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>
            ¿No tienes cuenta?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); onShowScreen("register"); }}>
              Créala aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
