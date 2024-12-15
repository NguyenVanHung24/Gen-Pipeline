import { Handle } from 'react-flow-renderer';
import { useState, useEffect } from 'react';
import toolData from '../tool.json';

const DropTargetNode = ({ data }) => {
  const [droppedImages, setDroppedImages] = useState([]);
  
  useEffect(() => {
    setDroppedImages(toolData);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchTerm.trim()) {
      setIsSearching(true);
    }
  };

  const handleClearSearch = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    setSearchTerm('');
    setIsSearching(false);
    console.log('clearing search');
    // Force re-render with all images
    const searchInput = e.target.parentElement.querySelector('input');
    if (searchInput) {
      searchInput.value = '';
    }
  };

  const handleSearchInput = (e) => {
    e.stopPropagation();
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setIsSearching(false);
    }
  };

  const displayedImages = isSearching && searchTerm.trim()
    ? droppedImages.filter(image => 
        image.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : droppedImages;

  const handleDragStart = (e, image) => {
    e.dataTransfer.setData('image', JSON.stringify({
      ...image,
      tool: image.tool
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  // const handleDragEnd = (e, imageId) => {
  //   if (e.dataTransfer.dropEffect === 'move') {
  //     setDroppedImages(prev => prev.filter(img => img.sourceNodeId !== imageId));
  //   }
  // };

  const handleDragOver = (e) => {
    if (e.currentTarget.classList.contains('drop-target-node')) {
      console.log("drag");
      e.preventDefault();
      e.currentTarget.classList.add('drag-over');
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e) => {
    // Prevent default browser drag/drop behavior and stop event propagation
    e.preventDefault();
    e.stopPropagation();

    // Check if the drop target is valid by verifying it has the correct CSS class
    const isValidDrop = e.currentTarget.classList.contains('drop-target-node');
    console.log("Addd");
    if (!isValidDrop) return;

    // Remove visual feedback that was added during drag over
    e.currentTarget.classList.remove('drag-over');

    try {
      // Get the dragged image data that was stored during drag start
      const imageData = JSON.parse(e.dataTransfer.getData('image'));

      // Check if this image already exists in droppedImages array by comparing sourceNodeId
      const exists = droppedImages.some(img => img.sourceNodeId === imageData.sourceNodeId);

      // Only add the image if it doesn't already exist
      if (!exists) {
        setDroppedImages(prev => [...prev, imageData]);
      }
    } catch (err) {
      // Log any errors that occur while parsing the dropped data
      console.error('Error parsing dropped image:', err);
    }
  };

  return (
    <div className="node-container drop-target-node"
      onDragOver={handleDragOver}
      onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
      onDrop={handleDrop}
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '400px'
      }}
    >
      
      <Handle type="target" position="left" style={{ flexShrink: 0 }} />
      
      <div style={{
        padding: '5px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        gap: '2px',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchInput}
          onClick={(e) => e.stopPropagation()}
          style={{
            flex: 1,
            padding: '3px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '11px',
            minWidth: 0
          }}
        />
        <button
          onClick={(e) => handleSearch(e)}
          style={{
            padding: '3px 6px',
            backgroundColor: '#2E86C1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            whiteSpace: 'nowrap'
          }}
        >
          Search
        </button>
        {isSearching && (
          <button
            onClick={(e) => handleClearSearch(e)}
            style={{
              padding: '3px 6px', 
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              whiteSpace: 'nowrap'
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="drop-zone" style={{ 
        flex: 1,
        overflowY: 'auto',
        minHeight: 0
      }}>
        {displayedImages.length > 0 ? (
          <div className="images-grid" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '10px',
            alignItems: 'center'
          }}>
            {displayedImages.map((image) => (
              <div
                key={image.sourceNodeId}
                className="image-item"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, image)}
                // onDragEnd={(e) => handleDragEnd(e, image.sourceNodeId)}
                style={{
                  width: '80%',
                  marginBottom: '10px'
                }}
              >
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '5px',
                  border: '1px solid #eee',
                  borderRadius: '4px'
                }}>
                  <img 
                    src={image.imageSrc} 
                    alt={image.type}
                    className="draggable-image"
                    style={{
                      width: '40px', 
                      height: '40px', 
                      objectFit: 'contain'
                    }} 
                    onError={(e) => {
                      console.error(`Failed to load image: ${image.imageSrc}`);
                      e.target.src = '/placeholder.png';
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    flex: 1,
                    textAlign: 'left'
                  }}>
                    {image.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{color: '#666', fontSize: '12px'}}>
            {isSearching ? 'No matching images found' : 'Drop images here'}
          </p>
        )}
      </div>
      <Handle type="source" position="right" style={{ flexShrink: 0 }} />
    </div>
  );
};

export default DropTargetNode;