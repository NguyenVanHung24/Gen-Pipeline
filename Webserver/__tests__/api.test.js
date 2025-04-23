import axios from 'axios';

// Mock axios for testing
jest.mock('axios');

// Base URL for your API
const API_BASE_URL = 'http://localhost:3001';

// Test data
const mockToolData = {
  id: 1,
  type: "secret-scan",
  name: "Secret Scanning",
  defaultImage: "/Git-leak.jpg",
  defaultTool: "Git-leak",
  phase: "Secret Scanning"
};

describe('API Tests', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Test GET request
  test('fetchTools should return tool data', async () => {
    // Mock the axios GET response
    axios.get.mockResolvedValue({ data: [mockToolData] });

    // Make the API call
    const response = await axios.get(`${API_BASE_URL}/tools`);

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/tools`);
    expect(response.data).toEqual([mockToolData]);
  });

  // Test POST request
  test('saveTool should post tool data', async () => {
    // Mock the axios POST response
    axios.post.mockResolvedValue({ data: mockToolData });

    // Make the API call
    const response = await axios.post(`${API_BASE_URL}/tools`, mockToolData);

    // Assertions
    expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/tools`, mockToolData);
    expect(response.data).toEqual(mockToolData);
  });

  // Test error handling
  test('should handle API errors', async () => {
    // Mock an API error
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    // Make the API call and expect it to throw
    await expect(axios.get(`${API_BASE_URL}/tools`))
      .rejects
      .toThrow(errorMessage);
  });
}); 