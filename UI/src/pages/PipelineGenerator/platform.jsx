import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';

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

    // Fetch platforms
    useEffect(() => {
        fetchPlatforms();
    }, []);

    const fetchPlatforms = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/platforms');
            setPlatforms(response.data.platforms);
        } catch (error) {
            console.error('Error fetching platforms:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                supported_languages: formData.supported_languages.split(',').map(lang => lang.trim())
            };

            if (editingId) {
                await axios.put(`http://localhost:3001/api/platforms/${editingId}`, data);
            } else {
                await axios.post('http://localhost:3001/api/platforms', data);
            }
            
            fetchPlatforms();
            resetForm();
        } catch (error) {
            console.error('Error saving platform:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this platform?')) {
            try {
                await axios.delete(`http://localhost:3001/api/platforms/${id}`);
                fetchPlatforms();
            } catch (error) {
                console.error('Error deleting platform:', error);
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

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <h2>{editingId ? 'Edit Platform' : 'Create Platform'}</h2>
                
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
                        <label>Supported Languages (comma-separated):</label>
                        <input
                            type="text"
                            value={formData.supported_languages}
                            onChange={(e) => setFormData({...formData, supported_languages: e.target.value})}
                            required
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <label>API URL:</label>
                        <input
                            type="text"
                            value={formData.config.api_url}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: {...formData.config, api_url: e.target.value}
                            })}
                            required
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.config.webhook_enabled}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    config: {...formData.config, webhook_enabled: e.target.checked}
                                })}
                                style={{ marginRight: '10px' }}
                            />
                            Webhook Enabled
                        </label>
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <label>Scan Frequency:</label>
                        <select
                            value={formData.config.scan_frequency}
                            onChange={(e) => setFormData({
                                ...formData,
                                config: {...formData.config, scan_frequency: e.target.value}
                            })}
                            style={{ marginLeft: '10px' }}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
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

                <h3>Platforms List</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Languages</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>API URL</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Webhook</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Frequency</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {platforms.map(platform => (
                            <tr key={platform._id}>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{platform.name}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{platform.supported_languages.join(', ')}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{platform.config.api_url}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{platform.config.webhook_enabled ? 'Yes' : 'No'}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{platform.config.scan_frequency}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                    <button 
                                        onClick={() => handleEdit(platform)}
                                        style={{ marginRight: '5px' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(platform._id)}
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

export default PlatformPage; 