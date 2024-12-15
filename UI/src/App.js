import React from 'react';
import AppRoutes from './Route';
import './styles.css';
import steps from './campaign';

const App = () => {
    return <AppRoutes steps={steps} />;
};

export default App; 