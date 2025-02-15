import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlinePhotograph 
} from 'react-icons/hi';
import axios from 'axios';
import { toast } from 'react-toastify';
import Upload from "../../components/Blog/Upload";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    img: ''
  });
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [img, setImg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACK_END_URL}/users/register`, 
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          img: img.url.split('/').pop(), 
        }
      );
      
      toast.success('Registration successful! Please login.');
      navigate('/blog/login');
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <div className="flex items-center">
                <HiOutlineUser className="h-5 w-5 text-gray-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
              </div>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center">
                <HiOutlineMail className="h-5 w-5 text-gray-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
              </div>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center">
                <HiOutlineLockClosed className="h-5 w-5 text-gray-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            {/* Profile Image URL (Optional) */}
            <div>
              <div className="flex items-center">
                <HiOutlinePhotograph className="h-5 w-5 text-gray-400 mr-2" />
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image URL (Optional)
                </label>
              </div>
              <div className="mt-1">
                  <Upload type="image" setProgress={setProgress} setData={setImg}>
                    <button type="button" className="btn-secondary">
                      Add a cover image
                    </button>
                  </Upload>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          By registering, you agree to our{' '}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
