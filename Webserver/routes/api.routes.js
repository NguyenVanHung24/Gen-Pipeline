const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipeline.controller');
const platformController = require('../controllers/platform.controller');
const toolController = require('../controllers/tool.controller');

// Pipeline routes
router.post('/pipelines', pipelineController.createPipeline);
router.get('/pipelines', pipelineController.getAllPipelines); 
router.get('/pipelines/search', pipelineController.searchPipelines);
router.get('/pipelines/:id', pipelineController.getPipelineById);
router.put('/pipelines/:id', pipelineController.updatePipeline);
router.delete('/pipelines/:id', pipelineController.deletePipeline);
router.post('/generate-yaml', pipelineController.generateYaml);

// Platform routes
router.post('/platforms', platformController.createPlatform);
router.get('/platforms', platformController.getAllPlatforms);
router.get('/platforms/search', platformController.searchPlatforms);
router.get('/platforms/:id', platformController.getPlatformById);
router.put('/platforms/:id', platformController.updatePlatform);
router.delete('/platforms/:id', platformController.deletePlatform);

// Tool routes
router.post('/tools', toolController.createTool);
router.get('/tools', toolController.getTools); // Changed from getAllTools to getTools based on tool.controller.js
router.get('/tools/search', toolController.searchTools);
router.get('/tools/:id', toolController.getToolById);
router.put('/tools/:id', toolController.updateTool);
router.delete('/tools/:id', toolController.deleteTool);

// Development routes
if (process.env.NODE_ENV === 'development') {
    const devController = require('../controllers/dev.controller');
    router.post('/dev/clean-database', devController.cleanDatabase);
}

module.exports = router;