import { useState, FormEvent } from "react";
import { supabase } from "../config/supabase";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Intentar login con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ form: "Correo o contraseña incorrectos." });
        } else {
          setErrors({ form: error.message });
        }
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Obtener información adicional del usuario desde la tabla
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('nombre')
          .eq('email', email)
          .single();

        if (userError || !userData) {
          onLogin(data.user.email?.split('@')[0] || 'Usuario');
        } else {
          onLogin(userData.nombre);
        }
      }

    } catch (err: any) {
      setErrors({ form: "Ocurrió un error al iniciar sesión." });
      setIsLoading(false);
    }
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
