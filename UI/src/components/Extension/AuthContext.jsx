// File: context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (userData) => {
    try {
      const { accessToken, ...userInfo } = userData;
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      setUser(userInfo);
      setError(null);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('accessToken');
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return {
    ...context,
    isLoaded: !context.loading,
    isSignedIn: !!context.user,
    isAdmin: context.user?.roles?.includes('admin'),
    isContributor: context.user?.roles?.includes('contributor'),
    hasRole: (role) => context.user?.roles?.includes(role)
  };
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within AuthProvider');
  }
  return {
    user: context.user,
    roles: context.user?.roles || []
  };
};

export default AuthContext;