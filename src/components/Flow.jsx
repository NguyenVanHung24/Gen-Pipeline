import { useState, useMemo } from 'react';
import ReactFlow from 'react-flow-renderer';

import Node from './Node';
import FullNode from './FullNode';
import Popover from './Popover';
import { generateFlow } from '../utils';
import DropTargetNode from './DropTargetNode';

const Flow = ({ mode, steps }) => {
  const [stepDetails, setStepDetails] = useState(null);
  const [movedIcons, setMovedIcons] = useState({});

  const handleIconDrop = (iconData) => {
    if (iconData === null) {
      setMovedIcons({});
    } else {
      setMovedIcons(prev => ({
        ...prev,
        [iconData.sourceNodeId]: iconData
      }));
    }
  };

  const nodeTypes = {
    basic: mode === 'fullscreen' ? FullNode : Node,
    dropTarget: DropTargetNode
  };

  const elements = useMemo(() => {
    const width = mode === 'profile' ? 250 : 400;
    const height = mode === 'profile' ? 140 : 390;
    const flow = generateFlow(width, height, steps);
    
    const dropTargetNode = {
      id: 'drop-target-1',
      type: 'dropTarget',
      position: { x: 20, y: 20 },
      data: {
        onIconDrop: handleIconDrop
      },
      draggable: false
    };

    const elements = flow
      .map((node) => ({
        id: `${mode}-${node.id}`,
        type: 'basic',
        data: { ...node },
        position: { x: node.x, y: node.y},
        sourcePosition: 'right',
        targetPosition: 'left',
        className: mode === 'profile' ? 'node' : 'fullnode',
      }))
      // .concat([dropTargetNode])
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
              label: `${label ? label + ': ' : ''}${count}`,
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
  }, [mode, steps]);

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
      </div>
      <div style={{ flex: 1 }}>
        <ReactFlow
          onElementClick={(evt, node) => {
            if(node.type !== 'smoothstep' && mode === 'profile')
              setStepDetails({ evt: evt.currentTarget, node });
          }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          paneMoveable={mode === 'fullscreen'}
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
      <Popover
        anchor={stepDetails?.evt || null}
        onClose={() => setStepDetails(null)}
        nodeData={stepDetails?.node || null}
        onBottom={true}
      />
    </div>
  );
};

export default Flow;