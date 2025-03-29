import { Handle } from 'react-flow-renderer';
import { useState, useEffect } from 'react';


const DropTargetNode = ({ data }) => {
  const [droppedImages, setDroppedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tools`);
        const data = await response.json();
        
        const mappedTools = data.tools.map(tool => ({
          sourceNodeId: tool._id,
          imageSrc: tool.imagePath,
          type: tool.config.type,
          tool: tool.name,
          analytics: tool.config.analytics,
          target: tool.config.target
        }));

        setDroppedImages(mappedTools);
      } catch (error) {
        console.error('Error fetching tools:', error);
        setDroppedImages([]);
      }
    };

    fetchTools();
  }, []);

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
        image.tool.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : droppedImages;

  const handleDragStart = (e, image) => {
    e.dataTransfer.setData('image', JSON.stringify({
      ...image,
      tool: image.tool,
      type: image.type,
      analytics: image.analytics,
      target: image.target
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    if (e.currentTarget.classList.contains('drop-target-node')) {
      e.preventDefault();
      e.currentTarget.classList.add('drag-over');
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isValidDrop = e.currentTarget.classList.contains('drop-target-node');
    if (!isValidDrop) return;
    e.currentTarget.classList.remove('drag-over');

    try {
      const imageData = JSON.parse(e.dataTransfer.getData('image'));
      const exists = droppedImages.some(img => img.sourceNodeId === imageData.sourceNodeId);
      if (!exists) {
        setDroppedImages(prev => [...prev, imageData]);
      }
    } catch (err) {
      console.error('Error parsing dropped image:', err);
    }
  };

  return (
    <div 
      className="node-container drop-target-node bg-white rounded-lg shadow-lg flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
      onDrop={handleDrop}
      style={{ maxHeight: '400px' }}
    >
      <Handle type="target" position="left" className="!w-3 !h-3 !border-2 !border-gray-300 !bg-white" />
      
      <div className="p-3 border-b border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={handleSearchInput}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium
                     hover:bg-primary-700 transition-colors duration-200 whitespace-nowrap"
          >
            Search
          </button>
          {isSearching && (
            <button
              onClick={handleClearSearch}
              className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm font-medium
                       hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {displayedImages.length > 0 ? (
          displayedImages.map((image) => (
            <div
              key={image.sourceNodeId}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, image)}
              className="group cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 
                            hover:border-primary-300 hover:bg-gray-50 transition-all duration-200">
                <img 
                  src={image.imageSrc} 
                  alt={image.type}
                  className="w-10 h-10 object-contain rounded-md"
                  onError={(e) => {
                    console.error(`Failed to load image: ${image.imageSrc}`);
                    e.target.src = '/placeholder.png';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600">
                    {image.tool}
                  </p>
                  {image.type && (
                    <p className="text-xs text-gray-500 truncate">
                      {image.type}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              {isSearching ? 'No matching tools found' : 'Drop tools here'}
            </p>
          </div>
        )}
      </div>

      <Handle type="source" position="right" className="!w-3 !h-3 !border-2 !border-gray-300 !bg-white" />
    </div>
  );
};

export default DropTargetNode;