import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Flow from '../../components/Flow';
import steps from '../../campaign';

const IndexPage = () => {
    const navigate = useNavigate();
    const [showFlow, setShowFlow] = useState(false);
    const [platforms, setPlatforms] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState({
        platform: '',
        language: ''
    });

    // Fetch platforms when component mounts
    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/platforms');
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
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Generate secure CI/CD pipelines with integrated security tools. 
                            Drag and drop security tools to create your custom DevSecOps pipeline.
                        </p>
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
                                        // Navigate with state to pass data to PipelineGenerator component
                                        navigate('/generate', {
                                            state: {
                                                platform: selectedConfig.platform.name,
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