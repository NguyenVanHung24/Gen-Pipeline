import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import Flow from '../../components/Flow';

const IndexPage = () => {
    const navigate = useNavigate();
    const [showFlow, setShowFlow] = useState(false);
    const [platforms, setPlatforms] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState({
        platform: '',
        language: ''
    });
    const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

    // Fetch platforms when component mounts
    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                console.log(API_BASE_URL);
                const response = await api.get(`${API_BASE_URL}/platforms`);
                setPlatforms(response.data.platforms);
                console.log(response.data.platforms);
            } catch (error) {
                console.error('Error fetching platforms:', error);
            }
        };
        fetchPlatforms();
    }, []);

    const languages = [
        "JavaScript",
        "Python", 
        "Java",
        "Go",
        "Ruby",
        "PHP",
        "C#",
        "TypeScript",
        "Rust",
        "Swift"
    ];

    const handleStartPipeline = () => {
        if (selectedConfig.platform && selectedConfig.language) {
            setShowFlow(true);
        } else {
            alert('Please select both platform and language');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="container mx-auto px-4 py-16">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-white mb-6">
                            DevSecOps Pipeline Generator
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Generate secure CI/CD pipelines with integrated security tools. 
                            Drag and drop security tools to create your custom DevSecOps pipeline template.
                        </p>
                        {/* Navigation Buttons */}
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => navigate('/blog')}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition duration-200 flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                </svg>
                                Visit Blog
                            </button>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="text-primary-500 text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Security First
                            </h3>
                            <p className="text-gray-400">
                                Integrate security tools seamlessly into your CI/CD pipeline
                            </p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="text-primary-500 text-4xl mb-4">🔄</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Automated Workflow
                            </h3>
                            <p className="text-gray-400">
                                Automate security scanning and vulnerability management
                            </p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="text-primary-500 text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Comprehensive Analysis
                            </h3>
                            <p className="text-gray-400">
                                Get detailed security reports and analytics
                            </p>
                        </div>
                    </div>

                    {/* Configuration Form */}
                    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Configure Your Pipeline
                        </h2>
                        <div className="space-y-6">
                            {/* Platform Selection */}
                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Select Platform
                                </label>
                                <select
                                    value={selectedConfig.platform}
                                    onChange={(e) => setSelectedConfig({
                                        ...selectedConfig,
                                        platform: e.target.value
                                    })}
                                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:border-primary-500 focus:ring-primary-500"
                                >
                                    <option value="">Choose a platform</option>
                                    {platforms.map(platform => (
                                        <option key={platform._id} value={platform._id}>
                                            {platform.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Language Selection */}
                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Select Language
                                </label>
                                <select
                                    value={selectedConfig.language}
                                    onChange={(e) => setSelectedConfig({
                                        ...selectedConfig,
                                        language: e.target.value
                                    })}
                                    className="w-full bg-gray-700 text-white rounded-md px-4 py-2 border border-gray-600 focus:border-primary-500 focus:ring-primary-500"
                                >
                                    <option value="">Choose a language</option>
                                    {languages.map(lang => (
                                        <option key={lang} value={lang}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Button */}
                            <button
                                onClick={() => {
                                    if (selectedConfig.platform && selectedConfig.language) {
                                        // Find the platform object from the platforms array to get its name
                                        const platformObj = platforms.find(p => p._id === selectedConfig.platform);
                                        // Navigate with state to pass data to FlowEditor component
                                        navigate('/flow-editor', {
                                            state: {
                                                platform: platformObj ? platformObj.name : selectedConfig.platform, // Pass platform name instead of ID
                                                language: selectedConfig.language
                                            }
                                        });
                                    } else {
                                        alert('Please select both platform and language');
                                    }
                                }}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-md transition duration-200"
                            >
                                Start Building Pipeline
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default IndexPage;