import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';

const CustomFlowNode = ({ data }) => {
  // State để theo dõi khi nào đang kéo thả trên node
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Handle drop event for tools
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const toolData = JSON.parse(e.dataTransfer.getData('application/json'));
      console.log('Drop event fired with data:', toolData);
      if (data.onDropTool && toolData) {
        data.onDropTool(toolData);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg p-4 ${isDragOver ? 'ring-2 ring-primary-500' : ''}`}
      style={{ 
        minWidth: '180px',
        minHeight: '150px',
        border: '1px solid #e2e8f0',
        position: 'relative', // Add positioning context
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      data-node-id={data.nodeId} // Add a data attribute for debugging
    >
      <div className="px-4 py-2 text-sm font-medium text-black text-center rounded-t-xl bg-gray-100">
        {data.phase}
      </div>

      <Handle
        type="target"
        position="left"
        className="!w-3 !h-3 !border-2 !border-gray-300 !bg-white"
        style={{ left: '-12px' }}
      />

      {/* Drop overlay to improve drop target area */}
      <div 
        className="absolute inset-0 z-10 rounded-xl" 
        style={{ pointerEvents: 'none' }} 
      />

      <div 
        className="p-4 flex flex-col items-center"
      >
        {data.hasImage && data.currentImage ? (
          <div className="flex flex-col items-center">
            <img 
              src={data.currentImage} 
              alt={data.currentTool}
              className="w-12 h-12 object-contain rounded-lg shadow-sm" 
              onError={(e) => {
                console.error('Node image failed to load:', e.target.src);
                console.log('Full node data:', data);
                e.target.src = '/tools/default.png';
              }}
              onLoad={() => console.log('Image loaded successfully:', data.currentImage)}
            />
            {data.currentTool && (
              <div className="mt-2 text-sm font-medium text-gray-700 text-center">
                {data.currentTool}
              </div>
            )}
          </div>
        ) : (
          <div 
            className={`w-full h-20 border-2 border-dashed ${isDragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300'} rounded-lg flex items-center justify-center`}
          >
            <p className="text-sm text-gray-400">Drop tool here</p>
          </div>
        )}
        
        {/* 
        <div className="mt-3 w-full flex justify-between text-xs text-gray-500">
          <div>Analytics: {data.analytics}</div>
          <div>Target: {data.target}</div>
        </div> 
        */}
      </div>

      <Handle
        type="source"
        position="right"
        className="!w-3 !h-3 !border-2 !border-gray-300 !bg-white"
        style={{ right: '-12px' }}
      />
    </div>
  );
};

export default CustomFlowNode;
