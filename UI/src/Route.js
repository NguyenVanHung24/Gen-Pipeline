import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CampaignProfile from './CampaignProfile';
import FullScreen from './FullScreen';
import PipelineGenerator from './pages/PipelineGenerator';
import PlatformPage from './pages/PipelineGenerator/platform';
import ToolPage from './pages/PipelineGenerator/tool';
import PipelinePage from './pages/PipelineGenerator/pipeline';
import Navigation from './components/Navigation';
import steps from './campaign';

const AppRoutes = () => {
    return (
        <Router>
            {/* <Navigation /> */}
            <Routes>
                {/* Redirect root to generate */}
                <Route path="/" element={<Navigate to="/generate" replace />} />

                {/* All components under /generate path */}
                <Route path="/generate" element={<PipelineGenerator steps={steps} />} />
                
                {/* CRUD Pages */}
                <Route path="/platforms" element={<PlatformPage />} />
                <Route path="/tools" element={<ToolPage />} />
                <Route path="/pipelines" element={<PipelinePage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
