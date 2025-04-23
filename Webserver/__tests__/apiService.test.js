import ApiService from '../services/api';
import axios from 'axios';

jest.mock('axios');

describe('ApiService', () => {
  const mockToolData = {
    id: 1,
    type: "secret-scan",
    name: "Secret Scanning",
    defaultImage: "/Git-leak.jpg",
    defaultTool: "Git-leak",
    phase: "Secret Scanning"
  };

  const mockNodeData = {
    nodeId: "node-1",
    currentImage: "/Git-leak.jpg",
    currentTool: "Git-leak",
    type: "secret-scan",
    analytics: 85
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tool APIs', () => {
    test('getTools should fetch tools successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: [mockToolData] });
      
      const result = await ApiService.getTools();
      
      expect(result).toEqual([mockToolData]);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/tools'));
    });

    test('saveTool should save tool data successfully', async () => {
      axios.post.mockResolvedValueOnce({ data: mockToolData });
      
      const result = await ApiService.saveTool(mockToolData);
      
      expect(result).toEqual(mockToolData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/tools'),
        mockToolData
      );
    });

    test('updateTool should update tool data successfully', async () => {
      axios.put.mockResolvedValueOnce({ data: mockToolData });
      
      const result = await ApiService.updateTool(1, mockToolData);
      
      expect(result).toEqual(mockToolData);
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/tools/1'),
        mockToolData
      );
    });
  });

  describe('Node APIs', () => {
    test('getNodeConfigs should fetch node configurations successfully', async () => {
      axios.get.mockResolvedValueOnce({ data: [mockNodeData] });
      
      const result = await ApiService.getNodeConfigs();
      
      expect(result).toEqual([mockNodeData]);
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/nodes'));
    });

    test('saveNodeConfig should save node configuration successfully', async () => {
      axios.post.mockResolvedValueOnce({ data: mockNodeData });
      
      const result = await ApiService.saveNodeConfig(mockNodeData);
      
      expect(result).toEqual(mockNodeData);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/nodes'),
        mockNodeData
      );
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(ApiService.getTools())
        .rejects
        .toThrow(errorMessage);
    });

    test('should handle API errors', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Bad Request' }
        }
      };
      axios.post.mockRejectedValueOnce(errorResponse);
      
      await expect(ApiService.saveTool(mockToolData))
        .rejects
        .toEqual(errorResponse);
    });
  });
}); 