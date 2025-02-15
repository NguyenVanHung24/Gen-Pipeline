const Comment = require("../models/comment.js");
const User = require("../models/user.js");

const commentController = {
  getPostComments: async (req, res) => {
    try {
      const comments = await Comment.find({ post: req.params.postId })
        .populate("user", "username img roles")
        .sort({ createdAt: -1 });

      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addComment: async (req, res) => {
    try {
      const userId = req.user?.id;
      const postId = req.params?.postId;
      const { desc } = req.body;

      const newComment = new Comment({
        desc,
        user: userId,
        post: postId,
      });

      const savedComment = await (await newComment.save())
        .populate("user", "username img roles");

      res.status(201).json(savedComment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const userId = req.user?.id;
      const userRoles = req.user?.roles;
      const commentId = req.params?.id;
      console.log(userId)
      if (userRoles.includes('admin')) {
        await Comment.findByIdAndDelete(commentId);
        return res.status(200).json("Comment has been deleted");
      }

      const deletedComment = await Comment.findOneAndDelete({
        _id: commentId,
        user: userId,
      });

      if (!deletedComment) {
        return res.status(403).json("You can delete only your comment!");
      }

      res.status(200).json("Comment deleted");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = commentController;
