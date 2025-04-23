import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import FlowGraph from '../../components/FlowGraph';
import Navigation from '../../components/Navigation';
import { useLocation } from 'react-router-dom';

const FlowEditor = () => {
  const location = useLocation();
  const { platform, language } = location.state || {};

  return (
    <div className="flex flex-col h-screen">
          <ReactFlowProvider>
            <FlowGraph platformId={platform} language={language} />
          </ReactFlowProvider>
    </div>
  );
};

export default FlowEditor;
