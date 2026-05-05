import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { saveUser } from "../utils/auth.js";

const getPasswordMetrics = (password) => {
  if (!password)              return { width: '0%',   color: '#ff4444', label: 'Too short' };
  if (password.length < 10)  return { width: '30%',   color: '#ff4444', label: 'Weak' };
  let score = 1;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score = 2;
  if (score === 2 && /[^A-Za-z0-9]/.test(password)) score = 3;
  return [
    { width: '50%',  color: '#ffcc00', label: 'Fair' },
    { width: '75%',  color: '#00e676', label: 'Strong' },
    { width: '100%', color: '#9d50bb', label: 'Legendary' },
  ][score - 1];
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Register() {
  const navigate      = useNavigate();
  const modalBodyRef  = useRef(null);

  const [currentStep,       setCurrentStep]       = useState('form');
  const [isModalOpen,       setIsModalOpen]       = useState(false);
  const [hasReadGuidelines, setHasReadGuidelines] = useState(false);
  const [showPassword,      setShowPassword]      = useState(false);
  const [showConfirmPwd,    setShowConfirmPwd]    = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('vault_reg_draft');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        return { username: d.username || '', email: d.email || '', password: '', confirmPassword: '', acceptTerms: false };
      } catch { /* ignore */ }
    }
    return { username: '', email: '', password: '', confirmPassword: '', acceptTerms: false };
  });

  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrength = useMemo(() => getPasswordMetrics(formData.password), [formData.password]);

  // Debounced draft save + live username validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username || formData.email) {
        sessionStorage.setItem('vault_reg_draft', JSON.stringify({ username: formData.username, email: formData.email }));
      }
      if (formData.username && formData.username.length < 5) {
        setErrors((p) => ({ ...p, username: 'Username must be at least 5 characters.' }));
      } else {
        setErrors((p) => ({ ...p, username: null }));
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [formData.username, formData.email]);

  useEffect(() => {
    if (showPassword || showConfirmPwd) {
      const t = setTimeout(() => { setShowPassword(false); setShowConfirmPwd(false); }, 7000);
      return () => clearTimeout(t);
    }
  }, [showPassword, showConfirmPwd]);

  const validateForm = () => {
    const errs = {};
    if (!formData.username.trim())                                  errs.username = 'Username is required.';
    else if (formData.username.length < 5)                          errs.username = 'Username must be at least 5 characters.';
    if (!formData.email.trim())                                     errs.email    = 'Email is required.';
    else if (!isValidEmail(formData.email))                         errs.email    = 'Invalid email format.';
    if (!formData.password)                                         errs.password = 'Password is required.';
    else if (formData.password.length < 10)                         errs.password = 'Password must be at least 10 characters.';
    if (!formData.confirmPassword)                                  errs.confirmPassword = 'Please confirm your password.';
    else if (formData.confirmPassword !== formData.password)        errs.confirmPassword = 'Passwords do not match.';
    if (!hasReadGuidelines)                                         errs.guidelines = 'Please review the Vault Protocols.';
    if (!formData.acceptTerms)                                      errs.terms    = 'You must accept the Terms of Trade.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const userData = {
        username: formData.username.trim(),
        email:    formData.email.trim(),
        password: formData.password, // stored for demo auth only
        id:       `user-${Date.now()}`,
        createdAt: Date.now(),
      };

      // Save to multi-user registry (won't overwrite other users)
      saveUser(userData);

      sessionStorage.removeItem('vault_reg_draft');
      window.dispatchEvent(new Event('authChange'));
      setCurrentStep('success');
      setIsSubmitting(false);
    }, 800);
  };

  const handleScrollGuidelines = () => {
    if (!modalBodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 15) setHasReadGuidelines(true);
  };

  if (currentStep === 'success') {
    return (
      <div className="login-wrapper">
        <div className="login-card success-state glass-morphism" role="status" aria-live="polite">
          <i className="fa-solid fa-circle-check shake-success" />
          <h2>WELCOME ABOARD!</h2>
          <p>Vault access granted for <strong>{formData.username}</strong></p>
          <button type="button" onClick={() => navigate('/login')} className="btn-login-submit">
            PROCEED TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-card glass-morphism register-card">
        <header className="login-header">
          <h2>JOIN THE VAULT</h2>
          <p>Create your collector account</p>
        </header>

        {Object.keys(errors).length > 0 && (
          <div className="error-box" role="alert">
            <i className="fa-solid fa-circle-exclamation" />
            <span>Please fix the errors below before continuing.</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="reg-username"><i className="fa-solid fa-at" /> Username</label>
            <input
              id="reg-username"
              type="text"
              className={`login-input ${errors.username ? 'input-error' : ''}`}
              placeholder="At least 5 characters"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              maxLength={20}
              autoComplete="username"
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email"><i className="fa-solid fa-envelope" /> Email</label>
            <input
              id="reg-email"
              type="email"
              className={`login-input ${errors.email ? 'input-error' : ''}`}
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password"><i className="fa-solid fa-lock" /> Password</label>
            <div className="password-input-wrapper">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`login-input ${errors.password ? 'input-error' : ''}`}
                placeholder="At least 10 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="new-password"
              />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword((p) => !p)}>
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
            {formData.password && (
              <div className="strength-bar-wrapper">
                <div className="strength-bar" style={{ width: passwordStrength.width, background: passwordStrength.color }} />
                <span className="strength-label" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
              </div>
            )}
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm"><i className="fa-solid fa-lock" /> Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                id="reg-confirm"
                type={showConfirmPwd ? 'text' : 'password'}
                className={`login-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                autoComplete="new-password"
              />
              <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPwd((p) => !p)}>
                <i className={`fa-solid ${showConfirmPwd ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          {/* Vault Protocols */}
          <div className="form-group">
            <button
              type="button"
              className="btn-read-guidelines"
              onClick={() => setIsModalOpen(true)}
              style={{
                background: hasReadGuidelines ? 'var(--success-bg)' : 'var(--bg-elevated)',
                border: `1px solid ${hasReadGuidelines ? 'var(--success)' : 'var(--border-color)'}`,
                color: hasReadGuidelines ? 'var(--success)' : 'var(--text-main)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                width: '100%',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <i className={`fa-solid ${hasReadGuidelines ? 'fa-check-circle' : 'fa-book-open'}`} style={{ marginRight: 8 }} />
              {hasReadGuidelines ? 'Vault Protocols Read ✓' : 'Read Vault Protocols'}
            </button>
            {errors.guidelines && <span className="field-error">{errors.guidelines}</span>}
          </div>

          {/* Terms */}
          <div className="checkbox-section">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              <span className="checkbox-label">I accept the Terms of Trade</span>
            </label>
            {errors.terms && <span className="field-error">{errors.terms}</span>}
          </div>

          <button type="submit" className="btn-login-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'CREATE VAULT ACCOUNT'}
          </button>
        </form>

        <div className="login-footer-links">
          <span>Already a collector?</span>{' '}
          <Link to="/login" className="register-link">Sign in</Link>
        </div>
      </div>

      {/* Guidelines modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} role="dialog" aria-modal="true" aria-label="Vault Protocols">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Vault Protocols</h3>
              <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div
              className="modal-body"
              ref={modalBodyRef}
              onScroll={handleScrollGuidelines}
              style={{ maxHeight: 380, overflowY: 'auto', padding: '20px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}
            >
              <h4>1. Respectful Community</h4>
              <p>Treat every member with respect. Zero tolerance for harassment, hate speech, or discriminatory behaviour. Violations result in immediate account suspension.</p>
              <h4 style={{ marginTop: 16 }}>2. Authentic Listings</h4>
              <p>All items must be accurately described. Include clear photos and honest condition grading. Counterfeit or stolen goods are strictly prohibited and will result in a permanent ban.</p>
              <h4 style={{ marginTop: 16 }}>3. Trade Integrity</h4>
              <p>Once a trade is confirmed, both parties are bound by its terms. Ship within 3 business days of payment confirmation. Disputes must be raised within 14 days of delivery.</p>
              <h4 style={{ marginTop: 16 }}>4. Privacy & Data</h4>
              <p>Never share personal addresses, phone numbers or financial details in public messages. All data is stored locally in this demo environment.</p>
              <h4 style={{ marginTop: 16 }}>5. Fair Pricing</h4>
              <p>Price manipulation, shill bidding, and artificial scarcity tactics are prohibited. Price your items fairly and transparently.</p>
              <h4 style={{ marginTop: 16 }}>6. Enforcement</h4>
              <p>Violations are reviewed by the moderation team. Depending on severity, consequences range from warnings to permanent exclusion. You have now reached the end. Scroll down to confirm you have read these protocols.</p>
              <div style={{ height: 20 }} />
              {hasReadGuidelines && (
                <p style={{ color: 'var(--success)', fontWeight: 700, textAlign: 'center' }}>
                  <i className="fa-solid fa-check-circle" /> Protocols acknowledged!
                </p>
              )}
            </div>
            <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: hasReadGuidelines ? 'var(--accent-purple)' : 'var(--bg-elevated)',
                  color: hasReadGuidelines ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${hasReadGuidelines ? 'var(--accent-purple)' : 'var(--border-color)'}`,
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {hasReadGuidelines ? 'Close' : 'Scroll to read all'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}