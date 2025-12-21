import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

interface AuthContextType {
  user: any;
  login: (formData: any) => Promise<void>;
  register: (formData: any) => Promise<void>;
  logout: () => void;
  updateUserContext: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('profile');
    if (token) {
      setUser(JSON.parse(token));
    }
  }, []);

  const login = async (formData: any) => {
    try {
      const { data } = await api.signIn(formData);
      localStorage.setItem('profile', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (error) {
      console.log(error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const register = async (formData: any) => {
    try {
      const { data } = await api.signUp(formData);
      localStorage.setItem('profile', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (error) {
      console.log(error);
      alert('Registration failed. Try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('profile');
    setUser(null);
    navigate('/');
  };

  const updateUserContext = (userData: any) => {
      setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
