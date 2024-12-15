const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipeline.controller');
const platformController = require('../controllers/platform.controller');
const toolController = require('../controllers/tool.controller');

// Pipeline routes
router.post('/pipelines', pipelineController.createPipeline);
router.get('/pipelines', pipelineController.getAllPipelines);
router.get('/pipelines/:id', pipelineController.getPipelineById);
router.put('/pipelines/:id', pipelineController.updatePipeline);
router.delete('/pipelines/:id', pipelineController.deletePipeline);
router.get('/pipelines/search', pipelineController.searchPipelines);
router.post('/generate-yaml', pipelineController.generateYaml);

// Platform routes
router.post('/platforms', platformController.createPlatform);
router.get('/platforms', platformController.getAllPlatforms);
router.get('/platforms/:id', platformController.getPlatformById);
router.put('/platforms/:id', platformController.updatePlatform);
router.delete('/platforms/:id', platformController.deletePlatform);
router.get('/platforms/search', platformController.searchPlatforms);

// Tool routes
router.post('/tools', toolController.createTool);
router.get('/tools', toolController.getAllTools);
router.get('/tools/:id', toolController.getToolById);
router.put('/tools/:id', toolController.updateTool);
router.delete('/tools/:id', toolController.deleteTool);
router.get('/tools/search', toolController.searchTools);

// Development routes
if (process.env.NODE_ENV === 'development') {
    const devController = require('../controllers/dev.controller');
    router.post('/dev/clean-database', devController.cleanDatabase);
}

module.exports = router;