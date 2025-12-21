import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api/index';
import './Auth.css'; // Reuse Auth styles

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    try {
      if (token) {
          await api.resetPassword(token, password);
          setMessage('Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...');
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Yeni Şifre Belirle</h2>
        {message && <div style={{color: 'green', marginBottom: '10px'}}>{message}</div>}
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="Yeni Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Yeni Şifre (Tekrar)"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-btn">Şifreyi Güncelle</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
