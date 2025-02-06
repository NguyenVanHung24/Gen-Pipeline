import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { 
    HiOutlineCode,
    HiOutlineServer, 
    HiOutlineTag,
    HiOutlineCog,
    HiOutlineCollection,
    HiOutlineTerminal
} from 'react-icons/hi';

const PipelinePage = () => {
    const [pipelines, setPipelines] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [tools, setTools] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        tools: [],
        platform: '',
        language: '',
        stage: '',
        version: '',
        yaml_content: ''
    });
    const [editingId, setEditingId] = useState(null);

    // Fetch initial data
    useEffect(() => {
        fetchPipelines();
        fetchPlatforms();
        fetchTools();
    }, []);

    const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

    const fetchPipelines = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/pipelines`);
            setPipelines(response.data.pipelines);
        } catch (error) {
            console.error('Error fetching pipelines:', error);
        }
    };

    const fetchPlatforms = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/platforms`);
            setPlatforms(response.data.platforms);
        } catch (error) {
            console.error('Error fetching platforms:', error);
        }
    };

    const fetchTools = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tools`);
            setTools(response.data.tools);
        } catch (error) {
            console.error('Error fetching tools:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_BASE_URL}/pipelines/${editingId}`, formData);
            } else {
                await axios.post(`${API_BASE_URL}/pipelines`, formData);
            }
            
            fetchPipelines();
            resetForm();
        } catch (error) {
            console.error('Error saving pipeline:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pipeline?')) {
            try {
                await axios.delete(`${API_BASE_URL}/${id}`);
                fetchPipelines();
            } catch (error) {
                console.error('Error deleting pipeline:', error);
            }
        }
    };

    const handleEdit = (pipeline) => {
        setEditingId(pipeline._id);
        setFormData({
            name: pipeline.name,
            tools: pipeline.tools.map(tool => tool._id),
            platform: pipeline.platform._id,
            language: pipeline.language,
            stage: pipeline.stage,
            version: pipeline.version,
            yaml_content: pipeline.yaml_content
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            tools: [],
            platform: '',
            language: '',
            stage: '',
            version: '',
            yaml_content: ''
        });
    };

    const stages = [
        'Secret Scanning',
        'Software Composition Analysis',
        'Static Application Security Testing',
        'Dynamic Application Security Testing',
        'Container Security',
        'Infrastructure as Code Scan',
        'Vulnerability Management'
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            {editingId ? 'Edit Pipeline' : 'Security Pipeline Management'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Configure and manage your security scanning pipelines
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

                {/* Pipeline Form */}
                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            {/* Pipeline Name */}
                            <div className="sm:col-span-6">
                                <div className="flex items-center">
                                    <HiOutlineCollection className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pipeline Name
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="input-field"
                                        placeholder="Security Scan Pipeline"
                                    />
                                </div>
                            </div>

                            {/* Platform Selection */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineServer className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Platform
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <select
                                        value={formData.platform}
                                        onChange={(e) => setFormData({...formData, platform: e.target.value})}
                                        required
                                        className="select-field"
                                    >
                                        <option value="">Select Platform</option>
                                        {platforms.map(platform => (
                                            <option key={platform._id} value={platform._id}>
                                                {platform.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Language Selection */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineCode className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Language
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <select
                                        value={formData.language}
                                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                                        required
                                        className="select-field"
                                    >
                                        <option value="">Select Language</option>
                                        <option value="Python">Python</option>
                                        <option value="Java">Java</option>
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="TypeScript">TypeScript</option>
                                        <option value="Go">Go</option>
                                        <option value="Ruby">Ruby</option>
                                        <option value="PHP">PHP</option>
                                        <option value="C#">C#</option>
                                        <option value="C/C++">C/C++</option>
                                        <option value="Rust">Rust</option>
                                        <option value="Swift">Swift</option>
                                        <option value="Kotlin">Kotlin</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tools Selection */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineCog className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Security Tools
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <select
                                        value={formData.tools}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            tools: [e.target.value]
                                        })}
                                        required
                                        className="select-field"
                                    >
                                        <option value="">Select Tool</option>
                                        {tools.map(tool => (
                                            <option key={tool._id} value={tool._id}>
                                                {tool.name} (v{tool.version})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Stage Selection */}
                            <div className="sm:col-span-3">
                                <div className="flex items-center">
                                    <HiOutlineTag className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pipeline Stage
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <select
                                        value={formData.stage}
                                        onChange={(e) => setFormData({...formData, stage: e.target.value})}
                                        required
                                        className="select-field"
                                    >
                                        <option value="">Select Stage</option>
                                        {stages.map(stage => (
                                            <option key={stage} value={stage}>
                                                {stage}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Version Input */}
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

                            {/* YAML Content */}
                            <div className="sm:col-span-6">
                                <div className="flex items-center">
                                    <HiOutlineTerminal className="h-5 w-5 text-gray-400 mr-2" />
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pipeline YAML
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <textarea
                                        value={formData.yaml_content}
                                        onChange={(e) => setFormData({...formData, yaml_content: e.target.value})}
                                        required
                                        className="input-field font-mono min-h-[200px] text-sm"
                                        placeholder="name: pipeline&#10;on:&#10;  push:&#10;    branches: [ main ]"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Define your pipeline configuration in YAML format
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="btn-primary">
                                {editingId ? 'Update Pipeline' : 'Create Pipeline'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Pipelines List */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Security Pipelines
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            List of configured security scanning pipelines
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="table-header">Pipeline</th>
                                    <th className="table-header">Platform & Language</th>
                                    <th className="table-header">Stage</th>
                                    <th className="table-header">Tools</th>
                                    <th className="table-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pipelines.map(pipeline => (
                                    <tr key={pipeline._id} className="hover:bg-gray-50">
                                        <td className="table-cell">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                        <HiOutlineCollection className="h-6 w-6 text-primary-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{pipeline.name}</div>
                                                    <div className="text-sm text-gray-500">v{pipeline.version}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="space-y-1">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {pipeline.platform.name}
                                                </span>
                                                <div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {pipeline.language}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {pipeline.stage}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {pipeline.tools.map(tool => (
                                                    <span 
                                                        key={tool._id}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                                    >
                                                        {tool.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(pipeline)}
                                                    className="btn-secondary text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(pipeline._id)}
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

export default PipelinePage;
