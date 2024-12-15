const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipeline.controller');

router.post('/generate-yaml', pipelineController.generateYaml);
router.get('/tools', pipelineController.getTools);
router.get('/platforms', pipelineController.getPlatforms);

module.exports = router;