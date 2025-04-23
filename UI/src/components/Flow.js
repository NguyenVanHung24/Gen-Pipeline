import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import FlowGraph from './FlowGraph';

const Flow = ({ config }) => {
  return (
    <ReactFlowProvider>
      <div style={{ height: 'calc(100vh - 80px)' }}>
        <FlowGraph config={config} />
      </div>
    </ReactFlowProvider>
  );
};

export default Flow;