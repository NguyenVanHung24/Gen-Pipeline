import React, { useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { Outlet } from 'react-router-dom';
import Flow from '../../components/Flow';
import Toolbar from '../../components/Toolbar';
import Navigation from '../../components/Navigation';
import steps from '../../campaign';

const Homepage = () => {
    const [mode, setMode] = useState('profile');

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h1>Homepage</h1>
        </div>
    );
};

export default Homepage;