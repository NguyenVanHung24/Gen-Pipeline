const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
// const { verifyToken } = require('../middlewares/auth'); // Assuming you have auth middleware

// Public route
router.get("/:postId", commentController.getPostComments);

// Protected routes - require authentication
router.post("/:postId", commentController.addComment);
router.delete("/:id" , commentController.deleteComment);

module.exports = router; 