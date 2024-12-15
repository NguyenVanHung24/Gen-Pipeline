import React from 'react';

const Layout = ({ children }) => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                backgroundColor: 'white',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                minHeight: 'calc(100vh - 60px)',
                marginTop: '20px',
                borderRadius: '8px'
            }}>
                {children}
            </div>
        </div>
    );
};

export default Layout; 