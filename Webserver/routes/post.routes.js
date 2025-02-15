const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/post.controller');
const increaseVisitController = require('../middlewares/increaseVisit');
const {verifyToken} = require('../middlewares/auth')
router.get('/upload-auth', postControllers.uploadAuth);
router.get('/', postControllers.getPosts);
router.get('/:slug', increaseVisitController.increaseVisit, postControllers.getPost);
router.post('/',verifyToken, postControllers.createPost);
router.delete('/:id',verifyToken, postControllers.deletePost);
router.patch('/feature', postControllers.featurePost);

module.exports = router;
