import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState(''); // Pode ser username ou email
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // 1. Puxa o usuário do LocalStorage
    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!storedUser) {
      setError("Nenhuma conta encontrada. Registe-se primeiro!");
      return;
    }

    // 2. NOVA LÓGICA DE VALIDAÇÃO:
    // Verifica se o 'identifier' bate com o email OU com o username
    const isUserValid = (identifier === storedUser.email || identifier === storedUser.username);
    const isPasswordValid = (password === storedUser.password);

    if (isUserValid && isPasswordValid) {
      // SUCESSO
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('currentUser', storedUser.username); // Sempre salva o username para o Header
      
      window.location.href = "/"; 
    } else {
      setError("Username/Email or Password incorrect.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>WELCOME BACK</h2>
        <p>Login with your username or email</p>

        {error && (
          <div className="error-box" style={{ color: '#ff4444', marginBottom: '15px' }}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label><i className="fa-solid fa-user"></i> Username or Email</label>
            <input 
              type="text" 
              placeholder="Username or name@example.com" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label><i className="fa-solid fa-lock"></i> Password</label>
            <div className="password-container" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
                required 
              />
              <i 
                className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <button type="submit" className="btn-login-submit">LOGIN TO ACCOUNT</button>
        </form>

        <div className="login-footer-links" style={{ marginTop: '20px' }}>
          New to the room? <Link to="/register" style={{ color: '#9d50bb', fontWeight: 'bold' }}>Register yourself</Link>
        </div>
      </div>
    </div>
  );
}