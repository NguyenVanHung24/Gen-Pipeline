import { useState, useMemo, useCallback } from 'react';
import ReactFlow from 'react-flow-renderer';

import Node from './Node';
import FullNode from './FullNode';
import Popover from './Popover';
import { generateFlow } from '../utils';
import DropTargetNode from './DropTargetNode';
import PipelineService from '../services/api';

const Flow = ({ mode, steps }) => {
  const [stepDetails, setStepDetails] = useState(null);
  const [nodesImageData, setNodesImageData] = useState({});
  const [pipelineYaml, setPipelineYaml] = useState('');
  const [showDataModal, setShowDataModal] = useState(false);
  const [currentData, setCurrentData] = useState(null);

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

  // Function to get pipeline YAML
  const generatePipeline = async () => {
    try {
      const response = await PipelineService.generatePipelineYaml(nodesImageData);
      setPipelineYaml(response.yaml);
      console.log('Generated Pipeline YAML:', response.yaml);
      
      // You could also show this in a modal or copy to clipboard
      navigator.clipboard.writeText(response.yaml)
        .then(() => alert('Pipeline YAML copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
        
    } catch (error) {
      console.error('Error generating pipeline:', error);
    }
  };

  // Function to handle getting all node data
  const handleGetNodesData = () => {
    const nodesData = getAllNodesData();
    setCurrentData(nodesData);
    setShowDataModal(true);
  };

  return (
    <>
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
          {/* Button container with flex layout */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px'
          }}>
            {/* Get Nodes Data button */}
            <button
              onClick={handleGetNodesData}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745', // Different color to distinguish
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Get Nodes Data
            </button>
            
            {/* Generate Pipeline button */}
            <button
              onClick={generatePipeline}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2E86C1',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Generate Pipeline
            </button>
          </div>
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
      
      {/* Modal for displaying node data */}
      {showDataModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <div 
              onClick={() => setShowDataModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '24px',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#f8f9fa',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e6ea'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              ×
            </div>

            <h3>Current Nodes Data</h3>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '10px',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(currentData, null, 2)}
            </pre>
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(currentData, null, 2));
                  alert('Copied to clipboard!');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowDataModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Flow;