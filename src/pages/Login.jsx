import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../App";
import { lookupUser } from "../utils/auth.js";

export default function Login() {
  const navigate       = useNavigate();
  const identifierRef  = useRef(null);
  const { user, login } = useAuth();

  const [identifier,   setIdentifier]   = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  useEffect(() => {
    try {
      const remembered = localStorage.getItem("vault_remember_me");
      if (remembered) {
        const { identifier: saved } = JSON.parse(remembered);
        setIdentifier(saved || "");
        setRememberMe(true);
      }
    } catch {
      localStorage.removeItem("vault_remember_me");
    }
  }, []);

  const validateLogin = useCallback(() => {
    if (!identifier.trim()) { setError("Please enter your username or email."); return false; }
    if (!password)          { setError("Password is required."); return false; }
    return true;
  }, [identifier, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateLogin()) return;
    setIsSubmitting(true);

    try {
      await new Promise((res) => setTimeout(res, 600));

      // Look up user in multi-user registry
      const storedUser = lookupUser(identifier);

      if (!storedUser) {
        throw new Error("No account found. Please register first!");
      }

      if (password !== storedUser.password) {
        throw new Error("Incorrect username/email or password.");
      }

      login(storedUser);

      if (rememberMe) {
        localStorage.setItem("vault_remember_me", JSON.stringify({ identifier }));
      } else {
        localStorage.removeItem("vault_remember_me");
      }

      sessionStorage.removeItem("vault_login_draft");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-card glass-morphism">
          <header className="login-header">
            <h2>WELCOME BACK</h2>
            <p>Access your vault using username or email</p>
          </header>

          {error && (
            <div className="error-box" role="alert">
              <i className="fa-solid fa-circle-exclamation" />
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="login-identifier">
                <i className="fa-solid fa-user" /> Username or Email
              </label>
              <input
                ref={identifierRef}
                id="login-identifier"
                type="text"
                className="login-input"
                placeholder="Username or name@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">
                <i className="fa-solid fa-lock" /> Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="password-toggle-btn" onClick={() => setShowPassword((p) => !p)}>
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>
            </div>

            <div className="checkbox-section">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-label">Remember me</span>
              </label>
            </div>

            <button type="submit" className="btn-login-submit" disabled={isSubmitting}>
              <span>{isSubmitting ? "Signing In..." : "LOGIN TO VAULT"}</span>
            </button>
          </form>

          <div className="login-footer-links">
            <span>New collector?</span>{" "}
            <Link to="/register" className="register-link">Create account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}