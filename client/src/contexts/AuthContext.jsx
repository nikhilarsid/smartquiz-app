import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast'; 


const AuthContext = createContext();


const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userInfoFromStorage);
  const [isLoading, setIsLoading] = useState(false);
  
  

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`); // <-- Success toast
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed.';
      toast.error(errorMessage); // <-- Error toast
      setIsLoading(false);
      return false;
    }
  };


  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Account created successfully!'); // <-- Success toast
      setIsLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed.';
      toast.error(errorMessage); // <-- Error toast
      setIsLoading(false);
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('You have been logged out.'); // <-- Logout toast
  };

  const value = {
    user,
    isLoading,
    
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};