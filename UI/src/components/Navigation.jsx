import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();
    
    return (
        <nav style={{
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6'
        }}>
            <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                gap: '1rem'
            }}>
                <li>
                    <Link 
                        to="/generate"
                        style={{
                            color: location.pathname === '/generate' ? '#0d6efd' : '#666',
                            textDecoration: 'none'
                        }}
                    >
                        Pipeline Generator
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/generate/campaign"
                        style={{
                            color: location.pathname === '/generate/campaign' ? '#0d6efd' : '#666',
                            textDecoration: 'none'
                        }}
                    >
                        Campaign Profile
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/generate/fullscreen"
                        style={{
                            color: location.pathname === '/generate/fullscreen' ? '#0d6efd' : '#666',
                            textDecoration: 'none'
                        }}
                    >
                        Full Screen
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation; 