import React, { useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { Outlet } from 'react-router-dom';
import Flow from '../../components/Flow';
import Toolbar from '../../components/Toolbar';
import Navigation from '../../components/Navigation';
import steps from '../../campaign';
import CampaignProfile from "../../CampaignProfile";

const PipelineGenerator = ({ steps }) => {
    const [mode, setMode] = useState('profile');

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ReactFlowProvider>
                <Toolbar
                    currentMode={mode}
                    changeMode={setMode}
                />
                { mode === 'profile' && (
                    <CampaignProfile steps={steps} />
                )}
                { mode === 'fullscreen' && (
                    <FullScreen steps={steps} />
                    
                )}
            </ReactFlowProvider>
            <Outlet />
        </div>
    );
};

export default PipelineGenerator; 