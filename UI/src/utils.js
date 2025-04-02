import dagre from 'dagre';

const generateFlow = (width, height, data) => {
  const flow = new dagre.graphlib.Graph();
  flow.setGraph({
    rankdir: 'LR',
    // align:'BT'
  });
  flow.setDefaultEdgeLabel(() => ({}));
  
  // Set nodes
  data.forEach(
    (node, index) => {
      flow.setNode(node.id,
        {
        width,
        height,
        ...node,
       
      });
    }
  );

  // Set edges
  data.forEach(
    ({ id, previous }) => {
      previous.forEach(({ stepId: previousId }) => {
        flow.setEdge(previousId, id);
      });
    }
  );

  dagre.layout(flow);
  return flow.nodes().map((i) => flow.node(i));
};

// New function to convert between flow formats
const convertToReactFlowElements = (nodes, connections = []) => {
  const elements = [];
  
  // Add nodes
  nodes.forEach(node => {
    elements.push({
      id: node.id.toString(),
      type: node.type || 'customNode',
      data: { 
        ...node,
        label: node.name || node.label || 'Node'
      },
      position: { x: node.position?.x || node.data?.x || 0, y: node.position?.y || node.data?.y || 0 },
      sourcePosition: 'right',
      targetPosition: 'left',
    });
  });
  
  // Add edges
  connections.forEach(connection => {
    elements.push({
      id: `e${connection.source}-${connection.target}`,
      source: connection.source.toString(),
      target: connection.target.toString(),
      animated: true,
      type: 'smoothstep',
    });
  });
  
  return elements;
};

// Generate a new node with unique ID
const createNewNode = (label, nodeType, x, y) => {
  return {
    id: `node_${Date.now()}`,
    type: nodeType || 'customNode',
    data: { 
      label,
      name: label,
      phase: nodeType || 'custom',
      data: {
        potentialTarget: 0,
        target: 0,
        analytics: [{ value: 0, label: 'Default', color: '#5285EC' }],
        percentOK: { label: 'Progress', value: 0 }
      }
    },
    position: { x, y }
  };
};

export {
  generateFlow,
  convertToReactFlowElements,
  createNewNode
};