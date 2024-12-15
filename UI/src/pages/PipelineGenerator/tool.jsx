import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

const ToolPage = () => {
    const [tools, setTools] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        version: '',
        config: {
            severity_levels: [],
            scan_timeout: 300,
            exclude_patterns: [],
            type: '',
            target: '',
            analytics: 0
        }
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTools();
    }, []);

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
            const data = {
                ...formData,
                config: {
                    ...formData.config,
                    severity_levels: formData.config.severity_levels.split(',').map(level => level.trim()),
                    exclude_patterns: formData.config.exclude_patterns.split(',').map(pattern => pattern.trim())
                }
            };

            if (editingId) {
                await axios.put(`http://localhost:3001/api/tools/${editingId}`, data);
            } else {
                await axios.post('http://localhost:3001/api/tools', data);
            }
            
            fetchTools();
            resetForm();
        } catch (error) {
            console.error('Error saving tool:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tool?')) {
            try {
                await axios.delete(`http://localhost:3001/api/tools/${id}`);
                fetchTools();
            } catch (error) {
                console.error('Error deleting tool:', error);
            }
        }
    };

    const handleEdit = (tool) => {
        setEditingId(tool._id);
        setFormData({
            name: tool.name,
            version: tool.version,
            config: {
                ...tool.config,
                severity_levels: tool.config.severity_levels.join(', '),
                exclude_patterns: tool.config.exclude_patterns.join(', ')
            }
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            version: '',
            config: {
                severity_levels: [],
                scan_timeout: 300,
                exclude_patterns: [],
                type: '',
                target: '',
                analytics: 0
            }
        });
    };

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <h2>{editingId ? 'Edit Tool' : 'Create Tool'}</h2>
                
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
                        <label>Severity Levels (comma-separated):</label>
                        <input
                            type="text"
                            value={formData.config.severity_levels}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: {...formData.config, severity_levels: e.target.value}
                            })}
                            placeholder="HIGH, CRITICAL"
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Scan Timeout (seconds):</label>
                        <input
                            type="number"
                            value={formData.config.scan_timeout}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: {...formData.config, scan_timeout: parseInt(e.target.value)}
                            })}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Exclude Patterns (comma-separated):</label>
                        <input
                            type="text"
                            value={formData.config.exclude_patterns}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: {...formData.config, exclude_patterns: e.target.value}
                            })}
                            placeholder=".env, *.log"
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Type:</label>
                        <input
                            type="text"
                            value={formData.config.type}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: {...formData.config, type: e.target.value}
                            })}
                            required
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Target:</label>
                        <input
                            type="text"
                            value={formData.config.target}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: {...formData.config, target: e.target.value}
                            })}
                            required
                            style={{ marginLeft: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Analytics Score:</label>
                        <input
                            type="number"
                            value={formData.config.analytics}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: {...formData.config, analytics: parseInt(e.target.value)}
                            })}
                            min="0"
                            max="100"
                            style={{ marginLeft: '10px' }}
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

                <h3>Tools List</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Version</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Target</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Analytics</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tools.map(tool => (
                            <tr key={tool._id}>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{tool.name}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{tool.version}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{tool.config.type}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{tool.config.target}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{tool.config.analytics}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                    <button 
                                        onClick={() => handleEdit(tool)}
                                        style={{ marginRight: '5px' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(tool._id)}
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

export default ToolPage;
