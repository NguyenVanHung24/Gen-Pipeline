import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();
    
    const isActiveLink = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-primary-600">
                                Pipeline Generator
                            </h1>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/generate"
                                className={`${
                                    isActiveLink('/generate')
                                        ? 'border-primary-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Generator
                            </Link>
                            <Link
                                to="/platforms"
                                className={`${
                                    isActiveLink('/platforms')
                                        ? 'border-primary-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Platforms
                            </Link>
                            <Link
                                to="/tools"
                                className={`${
                                    isActiveLink('/tools')
                                        ? 'border-primary-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Tools
                            </Link>
                            <Link
                                to="/pipelines"
                                className={`${
                                    isActiveLink('/pipelines')
                                        ? 'border-primary-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                            >
                                Pipelines
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 