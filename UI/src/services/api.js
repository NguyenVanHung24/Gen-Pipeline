import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Adjust to your API URL

class PipelineService {
  // Get all pipelines
  static async getAllPipelines() {
    try {
      const response = await axios.get(`${API_BASE_URL}/pipelines`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pipelines:', error);
      throw error;
    }
  }

  // Get pipeline by ID
  static async getPipelineById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/pipelines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline:', error);
      throw error;
    }
  }

  // Get pipeline by platform and language
  static async getPipelineByPlatformAndLanguage(platform, language) {
    try {
      const response = await axios.get(`${API_BASE_URL}/pipelines/search`, {
        params: { platform, language }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pipeline:', error);
      throw error;
    }
  }

  // Generate pipeline YAML from node data
  static async generatePipelineYaml(nodeData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/pipelines/generate`, {
        nodes: nodeData,
      });
      return response.data;
    } catch (error) {
      console.error('Error generating pipeline:', error);
      throw error;
    }
  }
}

export default PipelineService; 