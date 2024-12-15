import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CampaignProfile from './CampaignProfile';
import FullScreen from './FullScreen';
import PipelineGenerator from './pages/PipelineGenerator';
import steps from './campaign';
import Homepage from './pages/PipelineGenerator/home';
const AppRoutes = ({ steps }) => {
    return (
        <Router>
            <Routes>
                {/* Redirect root to generate */}
                <Route path="/" element={<Homepage />} />

                {/* All components under /generate path */}
                <Route path="/generate" element={<PipelineGenerator steps={steps} />}>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
