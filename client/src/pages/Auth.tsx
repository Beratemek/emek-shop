import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import * as api from '../api/index';
import './Auth.css';

const Auth = ({ isSignup }: { isSignup: boolean }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { login, register } = useAuth();
  const { t } = useLanguage();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
         if(formData.password !== formData.confirmPassword) return alert(t('auth.passwordMismatch'));
         await register(formData);
      } else {
         await login(formData);
      }
    } catch (error) {
      console.log('AUTH ERROR:', error);
      alert('Authentication failed. Check console for details.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.forgotPassword(resetEmail);
          setResetMessage('Şifre sıfırlama linki e-posta adresinize gönderildi.');
      } catch (error) {
          console.log(error);
          setResetMessage('Bir hata oluştu. Lütfen tekrar deneyiniz.');
      }
  };

  if (showForgotPassword) {
      return (
        <div className="auth-container">
          <div className="auth-card glass">
            <h2>Şifremi Unuttum</h2>
            {resetMessage && <p style={{color: 'green', marginBottom: '10px'}}>{resetMessage}</p>}
            <form onSubmit={handleForgotPassword}>
                <div className="input-group">
                    <input 
                        type="email" 
                        placeholder="E-posta Adresiniz" 
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-btn">Link Gönder</button>
                <button type="button" className="auth-btn" onClick={() => setShowForgotPassword(false)} style={{marginTop: '10px'}}>
                    Giriş Sayfasına Dön
                </button>
            </form>
          </div>
        </div>
      );
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <h2>{isSignup ? t('auth.createAccount') : t('auth.welcomeBack')}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <input type="text" name="name" placeholder={t('auth.fullName')} onChange={handleChange} required />
            </div>
          )}
          <div className="input-group">
            <input type="email" name="email" placeholder={t('auth.email')} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder={t('auth.password')} onChange={handleChange} required />
          </div>
          {isSignup && (
            <div className="input-group">
              <input type="password" name="confirmPassword" placeholder={t('auth.confirmPassword')} onChange={handleChange} required />
            </div>
          )}
          <button type="submit" className="auth-btn">{isSignup ? t('auth.signUp') : t('auth.signIn')}</button>
        </form>
        
        {!isSignup && (
            <button 
                type="button" 
                style={{background: 'none', border: 'none', color: '#fbbf24', marginTop: '10px', cursor: 'pointer', textDecoration: 'underline'}}
                onClick={() => setShowForgotPassword(true)}
            >
                Şifremi Unuttum
            </button>
        )}

        <div className="auth-switch">
            {isSignup ? t('auth.alreadyAccount') : t('auth.noAccount')}
            <Link to={isSignup ? '/login' : '/register'}>
               {isSignup ? t('auth.signIn') : t('auth.signUp')}
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
