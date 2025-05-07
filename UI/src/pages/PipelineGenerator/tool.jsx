import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../components/Extension/AuthContext';
import { toast } from 'react-toastify';
import { 
    HiOutlineCog, 
    HiOutlineTag, 
    HiOutlineClock, 
    HiOutlineExclamation,
    HiOutlineAdjustments,
    HiOutlineChartBar,
    HiOutlinePhotograph,
    HiOutlineWrench,
    HiOutlineCode,
    HiOutlineLink,
    HiOutlineChat,
    HiOutlineArrowLeft
} from 'react-icons/hi';

const ToolPage = () => {
    const [tools, setTools] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        version: '',
        imagePath: '',
        config: {
            severity_levels: 'critical, high, medium, low',
            scan_timeout: 300,
            exclude_patterns: 'node_modules, dist, build',
            type: '',
            target: 'Repository'
        }
    });
    const [editingId, setEditingId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    
    const { isSignedIn, isContributor, isLoaded, getToken } = useAuth();
    const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

    useEffect(() => {
        if (isLoaded && isSignedIn && isContributor) {
            fetchTools();
        }
    }, [isLoaded, isSignedIn, isContributor]);

    const fetchTools = async () => {
        try {
            const token = await getToken();
            const response = await api.get(`${API_BASE_URL}/tools`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTools(response.data.tools);
        } catch (error) {
            console.error('Error fetching tools:', error);
            toast.error('Failed to load tools. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('version', formData.version);
            formDataToSend.append('config', JSON.stringify(formData.config));
            
            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }

            if (editingId) {
                await api.put(`${API_BASE_URL}/tools/${editingId}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await api.post(`${API_BASE_URL}/tools`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            
            fetchTools();
            resetForm();
            setSelectedFile(null);
            toast.success(editingId ? 'Tool updated successfully' : 'Tool created successfully');
        } catch (error) {
            console.error('Error saving tool:', error);
            toast.error('Failed to save tool. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tool?')) {
            try {
                const token = await getToken();
                await api.delete(`${API_BASE_URL}/tools/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchTools();
            } catch (error) {
                console.error('Error deleting tool:', error);
                toast.error('Failed to delete tool. Please try again.');
            }
        }
    };

    const handleEdit = (tool) => {
        setEditingId(tool._id);
        setFormData({
            name: tool.name,
            version: tool.version,
            imagePath: tool.imagePath,
            config: {
                ...tool.config,
                severity_levels: Array.isArray(tool.config.severity_levels) ? 
                    tool.config.severity_levels.join(', ') : 
                    tool.config.severity_levels || '',
                exclude_patterns: Array.isArray(tool.config.exclude_patterns) ?
                    tool.config.exclude_patterns.join(', ') :
                    tool.config.exclude_patterns || '',
                scan_timeout: tool.config.scan_timeout || 300,
                type: tool.config.type || '',
                target: tool.config.target || 'Repository'
            }
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            version: '',
            imagePath: '',
            config: {
                severity_levels: 'critical, high, medium, low',
                scan_timeout: 300,
                exclude_patterns: 'node_modules, dist, build',
                type: '',
                target: 'Repository'
            }
        });
    };

    const toolTypes = [
        'Secret Scanning',
        'Software Composition Analysis',
        'Static Application Security Testing',
        'Dynamic Application Security Testing',
        'Container Security',
        'Infrastructure as Code Scan',
        'Vulnerability Management'
    ];

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
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
        navigate('/blog/login', { state: { from: '/tools' } });
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
                                    You do not have permission to access this page. Only contributors can manage tools.
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

                {/* Page Header */}
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            {editingId ? 'Edit Security Tool' : 'Security Tools Management'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Configure and manage your security scanning tools
                        </p>
                    </div>
                    {editingId && (
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn-secondary"
                            >
                                Cancel Editing
                            </button>
                        </div>
                    )}
                </div>

                {/* Tool Form */}
                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            {/* Tool Name */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineCog className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tool Name
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="input-field"
                                        placeholder="Snyk, SonarQube, etc."
                                    />
                                </div>
                            </div>

                            {/* Version */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineTag className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Version
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.version}
                                        onChange={(e) => setFormData({...formData, version: e.target.value})}
                                        required
                                        className="input-field"
                                        placeholder="1.0.0"
                                    />
                                </div>
                            </div>

                            {/* Tool Type */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineAdjustments className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tool Type
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <select
                                        value={formData.config.type}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            config: {...formData.config, type: e.target.value}
                                        })}
                                        required
                                        className="select-field"
                                    >
                                        <option value="">Select a type</option>
                                        {toolTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Scan Timeout */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineClock className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Scan Timeout (seconds)
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        value={formData.config.scan_timeout}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            config: {...formData.config, scan_timeout: parseInt(e.target.value)}
                                        })}
                                        required
                                        min="0"
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Severity Levels */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineExclamation className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Severity Levels
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.config.severity_levels}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            config: {...formData.config, severity_levels: e.target.value}
                                        })}
                                        required
                                        className="input-field"
                                        placeholder="critical, high, medium, low"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Separate severity levels with commas
                                </p>
                            </div>

                            {/* Target */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineAdjustments className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Target
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.config.target}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            config: { ...formData.config, target: e.target.value }
                                        })}
                                        required
                                        className="input-field"
                                        placeholder="Repository"
                                    />
                                </div>
                            </div>

                            {/* Tool Image */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlinePhotograph className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tool Image
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="input-field"
                                    />
                                </div>
                                {formData.imagePath && (
                                    <div className="mt-2">
                                        <img 
                                            src={`http://localhost:3001${formData.imagePath}`} 
                                            alt={formData.name}
                                            className="h-20 w-20 object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update Tool' : 'Create Tool'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tools List */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Available Security Tools
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            List of configured security scanning tools
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="table-header">Tool</th>
                                    <th className="table-header">Type</th>
                                    <th className="table-header">Configuration</th>
                                    <th className="table-header">Target</th>
                                    <th className="table-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tools.map(tool => (
                                    <tr key={tool._id} className="hover:bg-gray-50">
                                        <td className="table-cell">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                        <HiOutlineCog className="h-6 w-6 text-primary-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{tool.name}</div>
                                                    <div className="text-sm text-gray-500">v{tool.version}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {tool.config.type}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-500">
                                                    Timeout: {tool.config.scan_timeout}s
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.isArray(tool.config.severity_levels) 
                                                        ? tool.config.severity_levels.map(level => (
                                                            <span 
                                                                key={level}
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                                            >
                                                                {level}
                                                            </span>
                                                        ))
                                                        : null
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="text-sm text-gray-500">
                                                {tool.config.target}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(tool)}
                                                    className="btn-secondary text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(tool._id)}
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

export default ToolPage;
