const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/post.controller');
const increaseVisitController = require('../middlewares/increaseVisit');

router.get('/upload-auth', postControllers.uploadAuth);
router.get('/', postControllers.getPosts);
router.get('/:slug', increaseVisitController.increaseVisit, postControllers.getPost);
router.post('/', postControllers.createPost);
router.delete('/:id', postControllers.deletePost);
router.patch('/feature', postControllers.featurePost);

module.exports = router;
