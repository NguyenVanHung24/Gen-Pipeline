import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

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

    const fetchPipelines = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/pipelines');
            setPipelines(response.data.pipelines);
        } catch (error) {
            console.error('Error fetching pipelines:', error);
        }
    };

    const fetchPlatforms = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/platforms');
            setPlatforms(response.data.platforms);
        } catch (error) {
            console.error('Error fetching platforms:', error);
        }
    };

    const fetchTools = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/tools');
            setTools(response.data.tools);
        } catch (error) {
            console.error('Error fetching tools:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:3001/api/pipelines/${editingId}`, formData);
            } else {
                await axios.post('http://localhost:3001/api/pipelines', formData);
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
                await axios.delete(`http://localhost:3001/api/pipelines/${id}`);
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
        'Security Scan',
        'Software Analysis Scan',
        'Dependency Scan',
        'License Scan',
        'Secret Scan',
        'Container Scan',
        'Infrastructure as Code Scan',
        'API Security Scan',
        'Penetration Testing',
        'Compliance Scan',
        'Code Quality Scan',
        'Unit Testing',
        'Integration Testing'
    ];

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <h2>{editingId ? 'Edit Pipeline' : 'Create Pipeline'}</h2>
                
                <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Platform:</label>
                        <select
                            value={formData.platform}
                            onChange={(e) => setFormData({...formData, platform: e.target.value})}
                            required
                            style={{ marginLeft: '10px' }}
                        >
                            <option value="">Select Platform</option>
                            {platforms.map(platform => (
                                <option key={platform._id} value={platform._id}>
                                    {platform.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Tools:</label>
                        <select
                            multiple
                            value={formData.tools}
                            onChange={(e) => setFormData({
                                ...formData,
                                tools: Array.from(e.target.selectedOptions, option => option.value)
                            })}
                            required
                            style={{ marginLeft: '10px' }}
                        >
                            {tools.map(tool => (
                                <option key={tool._id} value={tool._id}>
                                    {tool.name} ({tool.version})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Language:</label>
                        <input
                            type="text"
                            value={formData.language}
                            onChange={(e) => setFormData({...formData, language: e.target.value})}
                            required
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Stage:</label>
                        <select
                            value={formData.stage}
                            onChange={(e) => setFormData({...formData, stage: e.target.value})}
                            required
                            style={{ marginLeft: '10px' }}
                        >
                            <option value="">Select Stage</option>
                            {stages.map(stage => (
                                <option key={stage} value={stage}>
                                    {stage}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Version:</label>
                        <input
                            type="text"
                            value={formData.version}
                            onChange={(e) => setFormData({...formData, version: e.target.value})}
                            required
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>YAML Content:</label>
                        <textarea
                            value={formData.yaml_content}
                            onChange={(e) => setFormData({...formData, yaml_content: e.target.value})}
                            required
                            style={{ 
                                marginLeft: '10px',
                                width: '100%',
                                height: '200px',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>
                    
                    <button type="submit" style={{ marginRight: '10px' }}>
                        {editingId ? 'Update' : 'Create'}
                    </button>
                    
                    {editingId && (
                        <button type="button" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </form>

                <h3>Pipelines List</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Platform</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Language</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Stage</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Version</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Tools</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pipelines.map(pipeline => (
                            <tr key={pipeline._id}>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{pipeline.name}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{pipeline.platform.name}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{pipeline.language}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{pipeline.stage}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{pipeline.version}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                    {pipeline.tools.map(tool => tool.name).join(', ')}
                                </td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                    <button 
                                        onClick={() => handleEdit(pipeline)}
                                        style={{ marginRight: '5px' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(pipeline._id)}
                                        style={{ backgroundColor: '#dc3545', color: 'white' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default PipelinePage;
