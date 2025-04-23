const Post = require('../models/post');

const increaseVisitController = {
  increaseVisit: async (req, res, next) => {
    try {
      // First increment the visit count
      await Post.findOneAndUpdate(
        { slug: req.params.slug },
        { $inc: { visit: 1 } }
      );
      
      // Then pass control to the next middleware (getPost)
      next();
    } catch (error) {
      next(error); // Pass errors to error handler
    }
  }
};

module.exports = increaseVisitController;
