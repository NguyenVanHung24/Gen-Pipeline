// import { SignIn } from "@clerk/clerk-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Extension/AuthContext';
import api from '../../utils/axios';
// import { useAuth } from '../../components/Extension/AuthContext';
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Add this function to test CORS
  const testCORS = () => {
    api.get('/test-cors')
      .then(response => {
        console.log('CORS test response:', response.data);
        toast.success('CORS test successful! Check console.');
      })
      .catch(error => {
        console.error('CORS test error:', error);
        toast.error('CORS test failed! Check console.');
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/users/login`, 
        formData,
        { withCredentials: true }
      );

      console.log('Login Response:', response.data); // Debug log

      const { accessToken, ...userData } = response.data;
      
      if (!accessToken) {
        throw new Error('No access token received');
      }

      // Use the login function from AuthContext
      await login({ accessToken, ...userData });
      
      toast.success('Login successful');
      navigate('/blog');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/blog/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="flex items-center">
                <HiOutlineMail className="h-5 w-5 text-gray-400 absolute ml-3" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="flex items-center">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-400 absolute ml-3" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={testCORS}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Test CORS
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
