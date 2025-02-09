import React from 'react';
import AppRoutes from './Route';
import './styles.css';
import steps from './campaign';
import { AuthProvider } from './components/Authen/AuthContext';
const App = () => { 
    return <AuthProvider>
        <AppRoutes steps={steps} />;
    </AuthProvider>
};

export default App; 