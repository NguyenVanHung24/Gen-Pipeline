import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
    const location = useLocation();
    
    const getLinkStyle = (path) => ({
        color: location.pathname === path ? '#0d6efd' : '#666',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        backgroundColor: location.pathname === path ? '#f8f9fa' : 'transparent'
    });

    return (
        <nav style={{
            padding: '1rem',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #dee2e6',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <li>
                    <Link to="/generate" style={getLinkStyle('/generate')}>
                        Pipeline Generator
                    </Link>
                </li>
                <li>
                    <Link to="/platforms" style={getLinkStyle('/platforms')}>
                        Platforms
                    </Link>
                </li>
                <li>
                    <Link to="/tools" style={getLinkStyle('/tools')}>
                        Tools
                    </Link>
                </li>
                <li>
                    <Link to="/pipelines" style={getLinkStyle('/pipelines')}>
                        Pipelines
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation; 