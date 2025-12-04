import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = apiClient.getToken();
    const savedUser = localStorage.getItem('salon-user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const token = await apiClient.login(credentials);
    const userData = { email: credentials.email };
    setUser(userData);
    localStorage.setItem('salon-user', JSON.stringify(userData));
    setIsAuthenticated(true);
    return token;
  };

  const register = async (userData) => {
    const newUser = await apiClient.register(userData);
    await login({ email: userData.email, password: userData.password });
    return newUser;
  };

  const logout = () => {
    apiClient.clearToken();
    localStorage.removeItem('salon-user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
