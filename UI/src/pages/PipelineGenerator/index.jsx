import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { Outlet, useLocation } from 'react-router-dom';
import Toolbar from '../../components/Toolbar';
import Navigation from '../../components/Navigation';
import steps from '../../campaign';
import CampaignProfile from "../../CampaignProfile";

const PipelineGenerator = () => {
    const location = useLocation();
    const { platform, language } = location.state || {};
   
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ReactFlowProvider>
                <CampaignProfile 
                    steps={steps} 
                    platform={platform}
                    language={language}
                />
            </ReactFlowProvider>
            <Outlet />
        </div>
    );
};

export default PipelineGenerator; 