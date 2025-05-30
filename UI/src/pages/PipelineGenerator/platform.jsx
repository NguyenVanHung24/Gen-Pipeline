import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../components/Extension/AuthContext';
import { toast } from 'react-toastify';
import { 
    HiOutlineGlobeAlt, 
    HiOutlineCode, 
    HiOutlineLink, 
    HiOutlineClock,
    HiOutlineChat,
    HiOutlineArrowLeft
} from 'react-icons/hi';

const PlatformPage = () => {
    const [platforms, setPlatforms] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        supported_languages: '',
        config: {
            api_url: '',
            webhook_enabled: false,
            scan_frequency: 'daily'
        }
    });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();
    
    const { isSignedIn, isContributor, isLoaded, getToken } = useAuth();
    const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

    useEffect(() => {
        if (isLoaded && isSignedIn && isContributor) {
            fetchPlatforms();
        }
    }, [isLoaded, isSignedIn, isContributor]);

    const fetchPlatforms = async () => {
        try {
            const token = await getToken();
            const response = await api.get(`${API_BASE_URL}/platforms`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPlatforms(response.data.platforms);
        } catch (error) {
            console.error('Error fetching platforms:', error);
            toast.error('Failed to load platforms. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const data = {
                ...formData,
                supported_languages: formData.supported_languages.split(',').map(lang => lang.trim())
            };

            if (editingId) {
                await api.put(`${API_BASE_URL}/platforms/${editingId}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await api.post(`${API_BASE_URL}/platforms`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            
            fetchPlatforms();
            resetForm();
            toast.success(editingId ? 'Platform updated successfully' : 'Platform created successfully');
        } catch (error) {
            console.error('Error saving platform:', error);
            toast.error('Failed to save platform. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this platform?')) {
            try {
                const token = await getToken();
                await api.delete(`${API_BASE_URL}/platforms/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchPlatforms();
            } catch (error) {
                console.error('Error deleting platform:', error);
                toast.error('Failed to delete platform. Please try again.');
            }
        }
    };

    const handleEdit = (platform) => {
        setEditingId(platform._id);
        setFormData({
            name: platform.name,
            supported_languages: platform.supported_languages.join(', '),
            config: platform.config
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            supported_languages: '',
            config: {
                api_url: '',
                webhook_enabled: false,
                scan_frequency: 'daily'
            }
        });
    };

    if (!isLoaded) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <p>Loading...</p>
                </div>
            </Layout>
        );
    }

    if (!isSignedIn) {
        toast.error('Please login to access this page');
        navigate('/blog/login', { state: { from: '/platforms' } });
        return null;
    }

    if (!isContributor) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-red-700">
                                    You do not have permission to access this page. Only contributors can manage platforms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/flow-editor')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <HiOutlineArrowLeft className="h-5 w-5 mr-2" />
                            Back to Flow Editor
                        </button>
                        <button
                            onClick={() => navigate('/blog')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <HiOutlineChat className="h-5 w-5 mr-2" />
                            Visit Blog
                        </button>
                    </div>
                </div>

                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            {editingId ? 'Edit Platform' : 'Platforms Management'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your security scanning platforms and their configurations
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-secondary ml-3"
                            >
                                Cancel Editing
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineGlobeAlt className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Platform Name
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="input-field"
                                        placeholder="GitHub, GitLab, etc."
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineCode className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Supported Languages
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.supported_languages}
                                        onChange={(e) => setFormData({...formData, supported_languages: e.target.value})}
                                        required
                                        className="input-field"
                                        placeholder="javascript, python, java"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Separate languages with commas
                                </p>
                            </div>

                            <div className="sm:col-span-4">
                                <div className="flex items-center">
                                    <HiOutlineLink className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        API URL
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.config.api_url}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            config: {...formData.config, api_url: e.target.value}
                                        })}
                                        required
                                        className="input-field"
                                        placeholder="https://api.platform.com"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <div className="flex items-center">
                                    <HiOutlineClock className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Scan Frequency
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <select
                                        value={formData.config.scan_frequency}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            config: {...formData.config, scan_frequency: e.target.value}
                                        })}
                                        className="select-field"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.config.webhook_enabled}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            config: {...formData.config, webhook_enabled: e.target.checked}
                                        })}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">
                                        Enable Webhooks
                                    </label>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Receive real-time notifications when changes occur
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update Platform' : 'Create Platform'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Configured Platforms
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            List of all available security scanning platforms
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="table-header">Platform</th>
                                    <th className="table-header">Languages</th>
                                    <th className="table-header">API URL</th>
                                    <th className="table-header">Configuration</th>
                                    <th className="table-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {platforms.map(platform => (
                                    <tr key={platform._id} className="hover:bg-gray-50">
                                        <td className="table-cell">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                        <HiOutlineGlobeAlt className="h-6 w-6 text-primary-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{platform.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {platform.supported_languages.map(lang => (
                                                    <span 
                                                        key={lang}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                                                    >
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="text-sm text-gray-500">{platform.config.api_url}</span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="space-y-1">
                                                <div className="flex items-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        platform.config.webhook_enabled 
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        Webhooks {platform.config.webhook_enabled ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Scans {platform.config.scan_frequency}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(platform)}
                                                    className="btn-secondary text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(platform._id)}
                                                    className="btn-danger text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PlatformPage;