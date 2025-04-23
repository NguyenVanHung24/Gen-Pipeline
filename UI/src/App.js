import React from 'react';
import AppRoutes from './Route';
import './styles.css';
import { AuthProvider } from './components/Extension/AuthContext';

const App = () => { 
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;