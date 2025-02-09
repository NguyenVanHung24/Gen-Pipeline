// File: context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
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
        const data = response.data.users; // Access the users key
        console.log('User data fetched:', response);
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          publicMetadata: {
            role: data.role // Access role directly
          }
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    // if (token) {
    //   fetchUser();
    // } else {
    //   setLoading(false);
    // }
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
    isSignedIn: !!context.user
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