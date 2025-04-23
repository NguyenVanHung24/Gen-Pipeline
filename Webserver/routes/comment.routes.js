const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { verifyToken } = require('../middlewares/auth'); // Assuming you have auth middleware

// Public route
router.get("/:postId", commentController.getPostComments);

// Protected routes - require authentication
router.post("/:postId", verifyToken, commentController.addComment);
router.delete("/:id" , verifyToken, commentController.deleteComment);

module.exports = router; 