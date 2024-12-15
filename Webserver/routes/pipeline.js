const express = require('express');
const router = express.Router();
const Pipeline = require('../models/Pipeline');

// Get all pipelines
router.get('/pipelines', async (req, res) => {
  try {
    const pipelines = await Pipeline.find()
      .populate('platform')
      .populate('tools');
    res.json(pipelines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pipeline by ID
router.get('/pipelines/:id', async (req, res) => {
  try {
    const pipeline = await Pipeline.findById(req.params.id)
      .populate('platform')
      .populate('tools');
    if (!pipeline) {
      return res.status(404).json({ message: 'Pipeline not found' });
    }
    res.json(pipeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search pipelines by platform and language
router.get('/pipelines/search', async (req, res) => {
  try {
    const { platform, language } = req.query;
    const pipeline = await Pipeline.findOne({
      platform: platform,
      language: language
    })
    .populate('platform')
    .populate('tools');
    
    if (!pipeline) {
      return res.status(404).json({ message: 'No matching pipeline found' });
    }
    res.json(pipeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate pipeline YAML from node data
router.post('/pipelines/generate', async (req, res) => {
  try {
    const { nodes } = req.body;
    
    // Generate YAML content based on node data
    const yamlContent = generatePipelineYaml(nodes);
    
    res.json({ yaml: yamlContent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to generate YAML
function generatePipelineYaml(nodes) {
  let yaml = `name: Security Scan Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security_scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2\n`;

  // Add steps for each tool in the nodes
  Object.values(nodes).forEach(node => {
    if (node.currentTool) {
      yaml += `
      - name: Run ${node.currentTool}
        uses: ${node.currentTool.toLowerCase()}-action@latest
        with:
          target: ${node.target || 'src/'}
          severity: high,critical
          timeout: 300\n`;
    }
  });

  return yaml;
}

module.exports = router; 