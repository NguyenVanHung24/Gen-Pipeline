import { Handle } from 'react-flow-renderer';
import { useState, useEffect } from 'react';

const availableImages = [
  '/Anchore.png',
  '/CheckCov.png',
  '/asst.jpg',
  '/Defect Dojo.png',
  '/git-hound.jpg',
  '/DependencyCheck.png',
  '/Git-leak.jpg',
  '/Git-secret.png',
  '/OWASPZAP.png',
  '/Snyk.png',
  '/Sonaqube.png',
  '/Trivy.png',
  '/Trufle-hog.png',
  '/Vault.png'
];

const getImage = (node) => {
  const index = Math.abs(node.id - 1) % availableImages.length;
  return availableImages[index];
}

const Node = ({ data: nodeData }) => {
  const defaultImage = nodeData.defaultImage || getImage(nodeData);
  const [currentImage, setCurrentImage] = useState(defaultImage);
  const [currentTool, setCurrentTool] = useState(nodeData.defaultTool || null);
  const [hasImage, setHasImage] = useState(!!defaultImage);

  useEffect(() => {
    if (nodeData.onImageUpdate) {
      nodeData.onImageUpdate(nodeData.id, {
        nodeId: nodeData.id,
        currentImage,
        currentTool,
        hasImage,
        phase: nodeData.phase,
        type: nodeData.type,
        analytics: nodeData.data.analytics[0]?.value || 0,
        target: nodeData.data.target
      });
      console.log("changed image/tool")
    }
  }, [currentImage, currentTool, hasImage, nodeData]);

  const handleDragStart = (e) => {
    const imageData = {
      type: nodeData.type,
      imageSrc: currentImage,
      tool: currentTool,
      phase: nodeData.phase,
      analytics: nodeData.data.analytics[0]?.value || 0,
      target: nodeData.data.target,
      sourceNodeId: nodeData.id,
      originalImage: defaultImage
    };
    e.dataTransfer.setData('image', JSON.stringify(imageData));
  };

  const handleDragEnd = (e) => {
    if (e.dataTransfer.dropEffect === 'move') {
      setHasImage(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isValidDrop = e.currentTarget.classList.contains('node-container');
    if (!isValidDrop) return;
    try {
      const imageData = JSON.parse(e.dataTransfer.getData('image'));
      setCurrentImage(imageData.imageSrc);
      setCurrentTool(imageData.tool);
      setHasImage(true);
    } catch (err) {
      console.error('Error parsing drop data:', err);
    }
  };

  const handleDragOver = (e) => {
    if (e.currentTarget.classList.contains('node-container')) {
      console.log("Drag from node");
      e.preventDefault();
      e.currentTarget.classList.add('can-drop');
      e.dataTransfer.dropEffect = 'move';
    }
  };

  return (
    <>
      <div 
        className={`bg-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl 
                   node-container ${!hasImage ? 'empty-node hover:border-primary-300' : ''}`}
        style={{ 
          minWidth: '200px',
          minHeight: '150px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onDragOver={handleDragOver}
        onDragLeave={(e) => e.currentTarget.classList.remove('can-drop')}
        onDrop={handleDrop}
      >
        <div className="px-4 py-2 text-sm font-medium text-black text-center rounded-t-xl bg-gray-100">
          {nodeData.phase}
        </div>

        {nodeData.previous.length > 0 && (
          <Handle
            type="target"
            position="left"
            className="!w-3 !h-3 !border-2 !border-gray-300 !bg-white hover:!border-primary-500"
            style={{
              left: '-12px'
            }}
          />
        )}

        <div className="p-4 flex flex-col items-center">
          {hasImage ? (
            <div
              draggable="true"
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="node-image-container group cursor-grab active:cursor-grabbing"
            >
              <img 
                src={currentImage} 
                alt={nodeData.type}
                className="w-12 h-12 object-contain rounded-lg shadow-sm 
                         transition-all duration-200 group-hover:scale-105 group-hover:shadow-md"
              />
              {currentTool && (
                <div className="mt-2 text-sm font-medium text-gray-700 text-center
                              transition-colors duration-200 group-hover:text-primary-600">
                  {currentTool}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-image-container w-12 h-12 border-2 border-dashed border-gray-300 
                           rounded-lg flex items-center justify-center text-gray-400
                           transition-colors duration-200 hover:border-primary-300 hover:text-primary-400
                           bg-gray-50 hover:bg-gray-100">
              <span className="text-xs font-medium">Drop here</span>
            </div>
          )}
        </div>

        {nodeData.final !== true && (
          <Handle
            type="source"
            position="right"
            className=""
            
          />
        )}
      </div>
    </>
  );
};

export default Node;