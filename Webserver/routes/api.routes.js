const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipeline.controller');
const platformController = require('../controllers/platform.controller');
const toolController = require('../controllers/tool.controller');
const userController  = require('../controllers/user.controller');
const { verifyToken, verifyContributor } = require('../middlewares/auth');

// Pipeline routes - protected with contributor middleware
router.post('/pipelines', verifyContributor, pipelineController.createPipeline);
router.get('/pipelines', pipelineController.getAllPipelines); 
router.get('/pipelines/search',  pipelineController.searchPipelines);
router.get('/pipelines/:id', pipelineController.getPipelineById);
router.put('/pipelines/:id', verifyContributor, pipelineController.updatePipeline);
router.delete('/pipelines/:id', verifyContributor, pipelineController.deletePipeline);
router.post('/generate-yaml', verifyContributor, pipelineController.generateYaml);

// Platform routes - protected with contributor middleware
router.post('/platforms', verifyContributor, platformController.createPlatform);
router.get('/platforms', platformController.getAllPlatforms);
router.get('/platforms/search',  platformController.searchPlatforms);
router.get('/platforms/:id', platformController.getPlatformById);
router.put('/platforms/:id', verifyContributor, platformController.updatePlatform);
router.delete('/platforms/:id', verifyContributor, platformController.deletePlatform);

// Tool routes - protected with contributor middleware
router.post('/tools', verifyContributor, toolController.createTool);
router.get('/tools', toolController.getTools);
router.get('/tools/search',  toolController.searchTools);
router.get('/tools/:id', toolController.getToolById);
router.put('/tools/:id',verifyContributor,  toolController.updateTool);
router.delete('/tools/:id', verifyContributor, toolController.deleteTool);

// Development routes
if (process.env.NODE_ENV === 'development') {
    const devController = require('../controllers/dev.controller');
    router.post('/dev/clean-database', devController.cleanDatabase);
}

module.exports = router;