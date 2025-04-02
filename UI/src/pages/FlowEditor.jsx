import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import FlowGraph from '../components/FlowGraph';
import Navigation from '../components/Navigation';

const FlowEditor = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex-1 p-4 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Pipeline Flow Editor</h1>
        <div className="border border-gray-200 rounded-lg h-[calc(100vh-130px)]">
          <ReactFlowProvider>
            <FlowGraph />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;
