import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [step, setStep] = useState('form');
  const [showModal, setShowModal] = useState(false);
  const [hasReadPolicies, setHasReadPolicies] = useState(false);
  const modalBodyRef = useRef(null);

  // Estados para controlar se a senha está visível ou não
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState({ width: '0%', color: '#ff4444', text: 'Too short' });

  // Barra de força da senha
  useEffect(() => {
    const val = formData.password;
    if (val.length === 0) setStrength({ width: '0%', color: '#ff4444', text: 'Too short' });
    else if (val.length < 10) setStrength({ width: '30%', color: '#ff4444', text: 'Weak' });
    else {
      let s = 1;
      if (/[A-Z]/.test(val) && /[0-9]/.test(val)) s = 2;
      if (s === 2 && /[^A-Za-z0-9]/.test(val)) s = 3;
      setStrength(
        s === 1 ? { width: '50%', color: '#ffcc00', text: 'Fair' } :
        s === 2 ? { width: '75%', color: '#00e676', text: 'Strong' } :
        { width: '100%', color: '#9d50bb', text: 'Legendary' }
      );
    }
  }, [formData.password]);

  // Validação ao clicar em Register
  const validate = () => {
    let newErrors = {};
    if (formData.username.length < 5) newErrors.username = "Please fill in this field (Min. 5 chars)";
    if (!formData.email.includes('@')) newErrors.email = "Please fill in this field with a valid email";
    if (formData.password.length < 10) newErrors.password = "Please fill in this field (Min. 10 chars)";
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";
    if (!hasReadPolicies) newErrors.policies = "Please scroll through guidelines first";
    if (!formData.terms) newErrors.terms = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleScroll = () => {
    if (modalBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setHasReadPolicies(true);
        setErrors(prev => ({ ...prev, policies: null }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('registeredUser', JSON.stringify(formData));
      setStep('success');
    }
  };

  if (step === 'success') {
    return (
      <div className="login-wrapper">
        <div className="login-card success-state">
          <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: '#00e676' }}></i>
          <h2>WELCOME!</h2>
          <p>Registration complete for <b>{formData.username}</b></p>
          <Link to="/login" className="btn-login-submit">GO TO LOGIN</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>NEW COLLECTOR</h2>
        <p>Join the most exclusive geek vault</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          
          {/* USERNAME */}
          <div className="form-group">
            <label><i className="fa-solid fa-user"></i> Username or Email</label>
            <input 
              type="text" 
              value={formData.username} 
              onChange={(e) => {
                setFormData({...formData, username: e.target.value});
                if(errors.username) setErrors({...errors, username: null});
              }} 
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label><i className="fa-solid fa-envelope"></i> Contact Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if(errors.email) setErrors({...errors, email: null});
              }} 
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label><i className="fa-solid fa-lock"></i> Password</label>
            <div className="password-wrapper">
              <input 
                type={showPass ? "text" : "password"} 
                value={formData.password} 
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value});
                  if(errors.password) setErrors({...errors, password: null});
                }} 
              />
              <button 
                type="button" 
                className="toggle-password-btn" 
                onClick={() => setShowPass(!showPass)}
              >
                <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <div className="strength-meter">
              <div className="strength-bar" style={{ width: strength.width, backgroundColor: strength.color }}></div>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">
            <label><i className="fa-solid fa-shield-halved"></i> Confirm Password</label>
            <div className="password-wrapper">
              <input 
                type={showConfirm ? "text" : "password"} 
                value={formData.confirmPassword} 
                onChange={(e) => {
                  setFormData({...formData, confirmPassword: e.target.value});
                  if(errors.confirmPassword) setErrors({...errors, confirmPassword: null});
                }} 
              />
              <button 
                type="button" 
                className="toggle-password-btn" 
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* POLÍTICAS */}
          <div style={{ marginBottom: '15px' }}>
            <button type="button" className={`policies-link-btn ${hasReadPolicies ? 'read' : ''}`} onClick={() => setShowModal(true)}>
              <i className={hasReadPolicies ? "fa-solid fa-check-circle" : "fa-solid fa-circle-info"}></i> 
              {hasReadPolicies ? " Guidelines Read" : " Read Community Guidelines"}
            </button>
            {errors.policies && <span className="error-message">{errors.policies}</span>}
          </div>

          {/* CHECKBOX */}
          <label className="checkbox-line-container">
            <input 
              type="checkbox" 
              checked={formData.terms} 
              onChange={(e) => {
                setFormData({...formData, terms: e.target.checked});
                if(errors.terms) setErrors({...errors, terms: null});
              }} 
            />
            <span className="checkbox-text">I'm not a robot & accept terms</span>
          </label>
          {errors.terms && <span className="error-message" style={{textAlign:'center', marginBottom: '10px'}}>{errors.terms}</span>}

          <button type="submit" className="btn-login-submit">CREATE ACCOUNT</button>
        </form>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Vault Guidelines</h3>
              <button className="close-x" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body" ref={modalBodyRef} onScroll={handleScroll}>
               <section><h4>1. Respect & Inclusivity</h4><p>Zero tolerance for racism or discrimination.</p></section>
               <section><h4>2. Anti-Scam Policy</h4><p>Honesty is mandatory in all listings.</p></section>
               <section><h4>3. Fraud & Security</h4><p>Manual registration only. Do not share your password.</p></section>
               <section><h4>4. Privacy & Data Safety</h4><p>We use industry-standard encryption to protect your data.</p></section>
               <div style={{padding: '20px', textAlign: 'center', color: hasReadPolicies ? '#00e676' : '#888'}}>
                {hasReadPolicies ? "✓ Guidelines read!" : "Scroll down to finish reading ↓"}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-close" onClick={() => setShowModal(false)}>
                {hasReadPolicies ? "Understood" : "Read to continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}