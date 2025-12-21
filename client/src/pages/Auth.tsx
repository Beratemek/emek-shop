import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import './Auth.css';

const Auth = ({ isSignup }: { isSignup: boolean }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { login, register } = useAuth();
  const { t } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
       if(formData.password !== formData.confirmPassword) return alert(t('auth.passwordMismatch'));
       register(formData);
    } else {
       login(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
