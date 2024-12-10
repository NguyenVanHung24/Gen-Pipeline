import { Handle }  from 'react-flow-renderer';
import { useState } from 'react';

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
  const stepImage = getImage(nodeData);
  const [currentImage, setCurrentImage] = useState(stepImage);
  const [hasImage, setHasImage] = useState(true);

  const handleDragStart = (e) => {
    const imageData = {
      type: nodeData.type,
      imageSrc: currentImage,
      analytics: nodeData.data.analytics[0]?.value || 0,
      target: nodeData.data.target,
      sourceNodeId: nodeData.id,
      originalImage: stepImage
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
      setHasImage(true);
    } catch (err) {
      console.error('Error parsing drop data:', err);
    }
  };

  const handleDragOver = (e) => {
    if (e.currentTarget.classList.contains('node-container')) {
      e.preventDefault();
      e.currentTarget.classList.add('can-drop');
      e.dataTransfer.dropEffect = 'move';
    }
  };

  return (
    <>
      <div 
        className={`node-container ${!hasImage ? 'empty-node' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={(e) => e.currentTarget.classList.remove('can-drop')}
        onDrop={handleDrop}
      >
        <div className={`node-status node-status-${nodeData.phase.toLowerCase()}`}>
          {nodeData.phase}
        </div>
        {nodeData.previous.length > 0 && (
          <Handle
            type="target"
            position="left"
            style={{
              border: '1px solid rgb(152,152,152)',
              backgroundColor: 'white',
            }}
          />
        )}
        <div style={{
          height: '100%',
          width: '100%',
          marginTop: 7,
          flex: 3,
          display: "flex",
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}>
          {hasImage ? (
            <div
              draggable="true"
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className="node-image-container"
            >
              <img 
                src={currentImage} 
                alt={nodeData.type}
                className="node-image"
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              />
              <div className="node-analytics">
                <span>{nodeData.data.analytics[0]?.value || 0}</span>
              </div>
            </div>
          ) : (
            <div className="empty-image-container">
              <span>Drop here</span>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", width: '100%', marginTop: '10px'}}>
            <div style={{ fontSize: '10px', paddingLeft: 5}} title="Target">
              <i className="fas fa-bullseye" style={{ color: '#2E86C1', paddingRight: 3}}></i>
              {nodeData.data.target}
            </div>
            <div style={{ fontSize: '10px', paddingRight: 5}} title={nodeData.data.percentOK?.label}>
              <i className="fas fa-check-circle" style={{ color: '#2E86C1', paddingRight: 3}}></i>
              {nodeData.data.percentOK?.value} %
            </div>
          </div>
        </div>
        {nodeData.final !== true && (
          <Handle
            type="source"
            position="right"
            style={{ 
              border: '1px solid rgb(152,152,152)',
              backgroundColor: 'white',
            }}
          />
        )}
      </div>
    </>
  );
};

export default Node;
