import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  removeElements
} from 'react-flow-renderer';
import CustomFlowNode from './CustomFlowNode';
import axios from 'axios';
import { useAuth } from '../components/Extension/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiOutlineCog, 
  HiOutlineServer, 
  HiOutlineCollection 
} from 'react-icons/hi';

const nodeTypes = {
  customNode: CustomFlowNode
};

// List of stage templates that can be added to the flow
const stageTemplates = [
  {
    type: 'Secret Scanning',
    phase: 'Secret Scanning',
  },
  {
    type: 'Software Composition Analysis',
    phase: 'Software Composition Analysis',
  },
  {
    type: 'Static Application Security Testing',
    phase: 'Static Application Security Testing',
  },
  {
    type: 'Dynamic Application Security Testing',
    phase: 'Dynamic Application Security Testing',
  },
  {
    type: 'Container Security',
    phase: 'Container Security',
  },
  {
    type: 'Infrastructure as Code Scan',
    phase: 'Infrastructure as Code Scan',
  },
  {
    type: 'Vulnerability Management',
    phase: 'Vulnerability Management',
  }
];

const FlowGraph = () => {
  const navigate = useNavigate();
  const { isContributor } = useAuth();
  const { platform, language } = useLocation().state || {};
  // Initial nodes based on provided data
  const initialElements = [
    // Nodes
    {
      id: '1',
      type: 'customNode',
      position: { x: 100, y: 100 },
      data: {
        nodeId: 1,
        currentImage: "",
        currentTool: "",
        hasImage: false,
        phase: "Secret Scanning",
        type: "Secret Scanning",
        analytics: 0,
        target: 100,
        onDropTool: (tool) => handleToolDropOnNode('1', tool)
      },
    },
    {
      id: '2',
      type: 'customNode',
      position: { x: 400, y: 100 },
      data: {
        nodeId: 2,
        currentImage: "",
        currentTool: "",
        hasImage: false,
        phase: "Software Composition Analysis",
        type: "Software Composition Analysis",
        analytics: 0,
        target: 100,
        onDropTool: (tool) => handleToolDropOnNode('2', tool)
      },
    },
    // Edge
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      style: { stroke: '#3182ce', strokeWidth: 2 }
    },
  ];

  // Set up state management for elements (nodes + edges combined in v9)
  const [elements, setElements] = useState(initialElements);
  // Track selected elements for deletion
  const [selectedElements, setSelectedElements] = useState([]);
  // Use a ref for the flow instance to access current methods
  const reactFlowWrapper = useRef(null);
  // Counter to generate unique IDs for new nodes
  const [nodeIdCounter, setNodeIdCounter] = useState(3); // Start from 3 since we already have nodes 1 and 2
  // State for available tools from API
  const [availableTools, setAvailableTools] = useState([]);
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [currentDragTool, setCurrentDragTool] = useState(null);

  const { isSignedIn, getToken } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_BACK_END_URL || 'http://localhost:3001/api';

  // State for modal display
  const [showDataModal, setShowDataModal] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [activeTab, setActiveTab] = useState('nodes');
  const [combinedYaml, setCombinedYaml] = useState('');
  const [toolSearchTerm, setToolSearchTerm] = useState('');

  // Fetch available tools from API
  useEffect(() => {
    const fetchTools = async () => {
      try {
        let response;
        if (isSignedIn) {
          const token = await getToken();
          response = await axios.get(`${API_BASE_URL}/tools`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          response = await axios.get(`${API_BASE_URL}/tools`);
        }

        console.log('API Response:', response.data);
        setAvailableTools(response.data.tools);
      } catch (error) {
        console.error('Error fetching tools:', error);
        toast.error('Failed to load tools. Please try again.');
      }
    };
    
    fetchTools();
  }, [isSignedIn, getToken, API_BASE_URL]);

  // Filter tools based on search term
  const filteredTools = useMemo(() => {
    if (!toolSearchTerm.trim()) return availableTools;
    
    return availableTools.filter(tool => 
      tool.name.toLowerCase().includes(toolSearchTerm.toLowerCase()) || 
      (tool.config?.type && tool.config.type.toLowerCase().includes(toolSearchTerm.toLowerCase()))
    );
  }, [availableTools, toolSearchTerm]);

  // Handle element removal (nodes or edges)
  const onElementsRemove = useCallback(
    (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els)),
    []
  );

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params) => {
      // Add animated style to new connections
      const edge = {
        ...params,
        animated: true,
        style: { stroke: '#3182ce', strokeWidth: 2 }
      };
      setElements((els) => addEdge(edge, els));
    },
    []
  );

  // Handle node dragging
  const onNodeDragStop = useCallback(
    (event, node) => {
      // Update node position when drag stops
      setElements((els) =>
        els.map((el) => (el.id === node.id ? { ...el, position: node.position } : el))
      );
    },
    []
  );

  // Track selected elements
  const onSelectionChange = useCallback((selectedItems) => {
    setSelectedElements(selectedItems || []);
  }, []);

  // Handle tool drop on node
  const handleToolDropOnNode = (nodeId, tool) => {
    console.log('Tool dropped on node:', nodeId);
    console.log('Tool data:', tool);
    console.log('Current elements:', elements);
    
    // Find the node being updated
    const node = elements.find(el => el.id === nodeId);
    console.log('Found node:', node);
    
    if (!node) {
      console.error('Node not found:', nodeId);
      toast.error('Error: Node not found. Please try again.');
      return;
    }

    // Validate if the tool's stage matches the node's stage
    if (tool.config?.type !== node.data.type) {
      console.log('Stage validation failed:', {
        toolType: tool.config?.type,
        nodeType: node.data.type
      });
      toast.error(`Invalid stage! This tool belongs to ${tool.config?.type} stage, but you're dropping it on ${node.data.type} stage.`);
      return;
    }
    
    setElements((els) => 
      els.map(el => {
        if (el.id === nodeId) {
          // Update the node with the dropped tool info
          const updatedData = {
            ...el.data,
            currentImage: tool.imagePath,
            currentTool: tool.name,
            hasImage: true,
            analytics: tool.config?.analytics || 0,
            target: tool.config?.target || 100,
            toolData: tool,
            onDropTool: el.data.onDropTool
          };
          
          console.log('Updated node data:', updatedData);
          
          return {
            ...el,
            data: updatedData
          };
        }
        return el;
      })
    );

    toast.success(`${tool.name} added to ${node.data.phase} stage`);
  };

  // Function to add a new node (stage) to the flow
  const addNewNode = (stageTemplate) => {
    const newNodeId = String(nodeIdCounter);
    
    // Create a new node based on the stage template
    const newNode = {
      id: newNodeId,
      type: 'customNode',
      position: { 
        x: Math.random() * 500 + 50,
        y: Math.random() * 500 + 50
      },
      data: {
        nodeId: nodeIdCounter,
        currentImage: "",
        currentTool: "",
        hasImage: false,
        phase: stageTemplate.phase,
        type: stageTemplate.type,
        analytics: 0,
        target: 100,
        toolData: null,
        onDropTool: (tool) => handleToolDropOnNode(newNodeId, tool)
      }
    };

    console.log('Adding new node:', newNode);

    // Add the new node to the elements array
    setElements((els) => [...els, newNode]);
    
    // Increment the ID counter for the next node
    setNodeIdCounter((prev) => prev + 1);
    
    // Show notification when adding a new node
    toast.info(`Added new ${stageTemplate.phase} node`);
  };

  // Handle tool drag start
  const handleDragStart = (e, tool) => {
    setIsDragging(true);
    setCurrentDragTool(tool);
    
    // Set data for drag and drop with full image path
    e.dataTransfer.setData('application/json', JSON.stringify(tool));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle tool drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setCurrentDragTool(null);
  };

  // Handle keyboard events for deletion
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 46 && selectedElements.length > 0) {
        // Delete key is pressed and there are selected elements
        onElementsRemove(selectedElements);
        setSelectedElements([]);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElements, onElementsRemove]);

  // Update the getAllNodesData function to include more details
  const getAllNodesData = () => {
    // Filter out only the custom nodes (not edges)
    const nodes = elements.filter(el => el.type === 'customNode');
    
    if (nodes.length === 0) {
      console.warn('No nodes found in the flow.');
      return {};
    }
    
    // Create an object with node data
    const nodesData = {};
    nodes.forEach(node => {
      nodesData[node.id] = {
        id: node.id,
        nodeId: node.data.nodeId,
        phase: node.data.phase,
        type: node.data.type,
        currentTool: node.data.currentTool || '',
        imagePath: node.data.currentImage || '',
        analytics: node.data.analytics,
        target: node.data.target,
        hasImage: node.data.hasImage,
        toolData: node.data.toolData || null
      };
    });
    
    console.log('All Nodes Data:', nodesData);
    return nodesData;
  };

  // Search pipeline for a node - improved version with better error handling
  const searchPipelineForNode = async (nodeData) => {
    // Skip nodes without tools
    if (!nodeData.currentTool) return null;
    
    console.log('Searching pipeline for node:', nodeData);
    
    try {
      // Add timeout to prevent hanging requests
      const response = await axios.get(`${API_BASE_URL}/pipelines/search`, {
        params: {
          tool: nodeData.currentTool,
          platform: platform, // Use platformId prop passed from FlowEditor
          stage: nodeData.phase,
          language: language // Use language prop passed from FlowEditor
        },
        timeout: 5000
      });

      console.log('Pipeline search response:', response.data);

      if (response.data.pipelines && response.data.pipelines.length > 0) {
        const yaml = response.data.pipelines[0].yaml_content;
        console.log('Found YAML for tool:', nodeData.currentTool, yaml);
        return yaml;
      }
      console.warn('No pipeline found for tool:', nodeData.currentTool);
      return null;
    } catch (error) {
      console.error(`Error searching pipeline for ${nodeData.currentTool}:`, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      return null;
    }
  };

  // Improved function to generate YAML with better data handling
  const handleGenerateYaml = async () => {
    const nodesData = getAllNodesData();
    
    if (Object.keys(nodesData).length === 0) {
      toast.warning('No nodes with tools to generate YAML for.');
      return;
    }
    
    console.log('Generating YAML for nodes:', nodesData);
    
    // Filter nodes that have tools assigned
    const nodesWithTools = Object.values(nodesData).filter(node => node.currentTool);
    
    if (nodesWithTools.length === 0) {
      toast.warning('Please assign tools to nodes first.');
      return;
    }
    
    toast.info(`Searching pipelines for ${nodesWithTools.length} tools...`, {
      autoClose: 2000
    });
    
    // Create promises array for each node
    const pipelinePromises = nodesWithTools.map(async (nodeData) => {
      const yaml = await searchPipelineForNode(nodeData);
      return {
        tool: nodeData.currentTool,
        phase: nodeData.phase,
        yaml: yaml
      };
    });

    try {
      // Wait for all promises to resolve
      const results = await Promise.all(pipelinePromises);
      
      // Filter out null results
      const validYamls = results.filter(result => result.yaml !== null);
      
      if (validYamls.length === 0) {
        toast.error('No pipelines found for the selected tools.');
        return;
      }
      
      console.log('Valid YAMLs found:', validYamls);
      
      // Combine all YAMLs with clear section headers
      const combined = validYamls.map(result => {
        return `# Pipeline for ${result.tool} (${result.phase})\n${result.yaml}\n---\n`;
      }).join('\n');

      console.log('Combined YAML:', combined);
      setCombinedYaml(combined);
      
      setCurrentData({
        nodesData: nodesData,
        combinedYaml: combined
      });
      
      setActiveTab('yaml');
      setShowDataModal(true);
      toast.success(`Generated YAML for ${validYamls.length} tools`);
    } catch (error) {
      console.error('Error generating YAML:', error);
      toast.error('Error generating YAML. Please try again.');
    }
  };

  // Function to handle "Get Nodes Data" button click
  const handleGetNodesData = () => {
    const nodesData = getAllNodesData();
    setCurrentData({ nodesData });
    setActiveTab('nodes');
    setShowDataModal(true);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar with stages */}
      <div className="flex flex-col w-72 border-r border-gray-200 bg-white">
        {/* Add Blog Redirect Button */}
        <div className="p-3 border-b bg-gray-50">
          <button
            onClick={() => navigate('/blog')}
            className="w-full py-2 px-4 mb-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition duration-200 text-sm flex items-center justify-center"
          >
            Go to Blog
          </button>
        </div>
        {/* Add Stage Panel - Adjusted height */}
        <div className="p-3 border-b h-2/3 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Add Stage
          </h3>
          <div className="overflow-y-auto flex-1 pr-1">
            <div className="space-y-2">
              {stageTemplates.map((stage, index) => (
                <div 
                  key={index}
                  className="p-2 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => addNewNode(stage)}
                >
                  <div className="font-medium text-sm">{stage.phase}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t bg-gray-50">
          <div className="space-y-2">
            <button
              onClick={handleGetNodesData}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 text-sm"
            >
              View Pipeline Data
            </button>
            
            <button
              onClick={handleGenerateYaml}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200 text-sm"
            >
              Generate YAML
            </button>

            {/* Contributor Management Buttons */}
            {isContributor && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Management</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/pipelines')}
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-200 text-sm flex items-center justify-center"
                >
                  <HiOutlineCollection className="h-5 w-5 mr-2" />
                  Manage Pipelines
                </button>

                <button
                  onClick={() => navigate('/platforms')}
                  className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition duration-200 text-sm flex items-center justify-center"
                >
                  <HiOutlineServer className="h-5 w-5 mr-2" />
                  Manage Platforms
                </button>

                <button
                  onClick={() => navigate('/tools')}
                  className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md transition duration-200 text-sm flex items-center justify-center"
                >
                  <HiOutlineCog className="h-5 w-5 mr-2" />
                  Manage Tools
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Flow Editor */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          elements={elements}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          connectionLineStyle={{ stroke: '#3182ce' }}
          defaultZoom={0.7} // Adjusted to 70% of the current size
          minZoom={0.2}
          maxZoom={4}
          fitView
          deleteKeyCode={46} // Use Delete key (key code 46)
        >
          <Controls />
          <MiniMap 
            nodeStrokeColor="#3182ce"
            nodeColor="#e2e8f0"
          />
          <Background color="#f8fafc" gap={16} />
        </ReactFlow>
      </div>

      {/* Tools Panel - Adjusted height */}
      <div className="flex flex-col w-72 border-l border-gray-200 bg-white">
        <div className="p-4 h-3/4 overflow-auto flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Drag & Drop Tools
          </h3>
          {/* Search bar for tools */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search tools..."
              value={toolSearchTerm}
              onChange={(e) => setToolSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div className="space-y-2 flex-1 overflow-auto">
            {filteredTools.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No tools found matching your search
              </div>
            ) : (
              filteredTools.map((tool) => (
                <div 
                  key={tool._id}
                  className="p-3 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-grab transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, tool)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center gap-3">
                    {tool.imagePath && (
                      <img 
                        src={tool.imagePath}
                        alt={tool.name} 
                        className="w-10 h-10 object-contain rounded" 
                        onError={(e) => {
                          console.error('Tool image failed to load:', e.target.src);
                          e.target.src = '/tools/default.png';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{tool.name}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{tool.config?.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for displaying data */}
      {showDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-4/5 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">{activeTab === 'nodes' ? 'Pipeline Configuration Data' : 'Generated YAML Configuration'}</h3>
              <button 
                onClick={() => setShowDataModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${activeTab === 'nodes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('nodes')}
              >
                Node Configuration
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'yaml' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('yaml')}
              >
                YAML Output
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-5">
              {activeTab === 'nodes' ? (
                <pre className="text-sm bg-gray-50 p-4 rounded-md overflow-auto max-h-[50vh]">
                  {JSON.stringify(currentData?.nodesData, null, 2)}
                </pre>
              ) : (
                <pre className="text-sm bg-gray-50 p-4 rounded-md overflow-auto max-h-[50vh]">
                  {combinedYaml || 'No YAML content available for current nodes. Add tools to nodes and try again.'}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  const content = activeTab === 'nodes' 
                    ? JSON.stringify(currentData?.nodesData, null, 2)
                    : combinedYaml;
                  navigator.clipboard.writeText(content);
                  toast.success('Copied to clipboard!');
                }}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
              >
                Copy to Clipboard
              </button>
              
              <button
                onClick={() => setShowDataModal(false)}
                className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowGraph;
