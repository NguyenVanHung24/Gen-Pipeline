// File: context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Add error state
  const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

  // Fake data for testing
  const fakeUser = {
    id: '1',
    username: 'testuser',
    email: 'testuser@example.com',
    publicMetadata: {
      role: 'admin'
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user with token:', token);
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Fix: Access data directly from response.data instead of response.data.users
        const data = response.data; // Changed from response.data.users
        console.log('User data fetched:', data);
        
        if (!data) {
          throw new Error('No user data received');
        }

        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          publicMetadata: {
            role: data.role
          }
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error);  // Set error state
        logout();
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if there's a token
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const data = { token: 'fake-jwt-token' };
    console.log('Logging in with credentials:', credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const register = async (userData) => {
    const data = { token: 'fake-jwt-token' };
    console.log('Registering with userData:', userData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const getToken = () => {
    return token;
  };

  const value = {
    user,
    token,
    loading,
    error,    // Add error to context
    login,
    register,
    logout,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hooks
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return {
    getToken: context.getToken,
    isLoaded: !context.loading,
    isSignedIn: !!context.user,
    user: context.user,
    login: context.login,
    logout: context.logout,
    register: context.register
  };
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within AuthProvider');
  }
  console.log('AuthContext:', context.user);
  return {
    user: context.user,
    publicMetadata: context.user?.publicMetadata || {}
  };
};