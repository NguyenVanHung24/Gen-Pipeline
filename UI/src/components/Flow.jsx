import { useState, useMemo, useCallback } from 'react';
import ReactFlow from 'react-flow-renderer';

import Node from './Node';
import FullNode from './FullNode';
import Popover from './Popover';
import { generateFlow } from '../utils';
import DropTargetNode from './DropTargetNode';

const Flow = ({ mode, steps }) => {
  const [stepDetails, setStepDetails] = useState(null);
  const [nodesImageData, setNodesImageData] = useState({});

  const handleNodeImageUpdate = useCallback((nodeId, imageData) => {
    // This function updates the image data for a specific node
    // It takes two parameters:
    // - nodeId: The unique identifier for the node being updated
    // - imageData: The new image data to store for that node
    
    // It uses the setNodesImageData state setter function to update the state
    // The prev => syntax allows us to safely update based on previous state
    setNodesImageData(prev => ({
      ...prev,  // Spread the existing nodes image data
      [nodeId]: imageData  // Add/update the image data for this specific node
    }));
    
    // useCallback is used to memoize this function to prevent unnecessary re-renders
  }, []); // Empty dependency array since this function doesn't depend on any props/state

  const nodeTypes = {
    basic: mode === 'fullscreen' ? FullNode : Node,
    dropTarget: DropTargetNode
  };

  const getAllNodesData = () => {
    console.log('Current Nodes Image Data:', nodesImageData);
    return nodesImageData;
  };

  const elements = useMemo(() => {
    const width = mode === 'profile' ? 250 : 400;
    const height = mode === 'profile' ? 140 : 390;
    const flow = generateFlow(width, height, steps);
    
    const elements = flow
      .map((node) => {
        return {
          id: `${mode}-${node.id}`,
          type: 'basic',
          data: { 
            ...node,
            onImageUpdate: handleNodeImageUpdate
          },
          position: { x: mode === 'profile' ? node.data.x : node.data.x * 2, y: mode === 'profile' ? node.data.y  : node.data.y * 2 },
          sourcePosition: 'right',
          targetPosition: 'left',
          className: mode === 'profile' ? 'node' : 'fullnode',
        };
      })
      .concat(
        steps.map(({ id, previous }) =>
          previous.map(
            ({ stepId: previousId, count, label }) => ({
              id: `${mode}-${id}-${previousId}}`,
              source: `${mode}-${previousId}`,
              target: `${mode}-${id}`,
              arrowHeadType: 'none',
              style: {
                strokeWidth: 2,
                stroke: 'rgb(152,152,152)'
              },
              type: 'smoothstep',
              labelShowBg: true,
              labelBgPadding: [10, 5],
              labelBgBorderRadius: 4,
              labelStyle: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 15,
              },
              labelBgStyle: {
                fill: 'rgb(217,217,217)',
                stroke: 'rgb(152,152,152)',
              },
            })
          )
        ).flat()
      );
    return elements;
  }, [mode, steps, handleNodeImageUpdate]);

  return (
    <div style={{
      height: '100%',
      backgroundColor: '#efefef',
      position: 'relative',
      display: 'flex'
    }}>
      <div style={{
        width: '200px',
        flexShrink: 0,
        borderRight: '1px solid #ccc'
      }}>
        <DropTargetNode />
        <button
          onClick={getAllNodesData}
          style={{
            margin: '10px',
            padding: '8px 16px',
            backgroundColor: '#2E86C1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Get Nodes Data
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow
          onElementClick={(evt, node) => {
            if(node.type !== 'smoothstep' && mode === 'profile')
              setStepDetails({ evt: evt.currentTarget, node });
          }}
          nodesDraggable={mode === 'fullscreen'}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnPinch={mode === 'fullscreen'}
          zoomOnScroll={mode === 'fullscreen'}
          zoomOnDoubleClick={mode === 'fullscreen'}
          nodeTypes={nodeTypes}
          elements={elements}
          defaultZoom={1}
          minZoom={0.5}
          maxZoom={2}
        />
      </div>
    </div>
  );
};

export default Flow;