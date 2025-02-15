const ImageKit = require('imagekit');
const Post = require('../models/post.js');
const User = require('../models/user.js');

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

const postController = {
  getPosts: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const query = {};

    console.log(req.query);

    const cat = req.query.cat;
    const author = req.query.author;
    const searchQuery = req.query.search;
    const sortQuery = req.query.sort;
    const featured = req.query.featured;

    if (cat) {
      query.category = cat;
    }

    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: "i" };
    }

    if (author) {
      const user = await User.findOne({ username: author }).select("_id");

      if (!user) {
        return res.status(404).json("No post found!");
      }

      query.user = user._id;
    }

    let sortObj = { createdAt: -1 };

    if (sortQuery) {
      switch (sortQuery) {
        case "newest":
          sortObj = { createdAt: -1 };
          break;
        case "oldest":
          sortObj = { createdAt: 1 };
          break;
        case "popular":
          sortObj = { visit: -1 };
          break;
        case "trending":
          sortObj = { visit: -1 };
          query.createdAt = {
            $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          };
          break;
        default:
          break;
      }
    }

    if (featured) {
      query.isFeatured = true;
    }

    try {
      const posts = await Post.find(query)
        .populate("user", "username")
        .sort(sortObj)
        .limit(limit)
        .skip((page - 1) * limit);

      const totalPosts = await Post.countDocuments();
      const hasMore = page * limit < totalPosts;

      res.status(200).json({ posts, hasMore });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug }).populate(
        "user",
        "username img"
      );
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createPost: async (req, res) => {
    try {
      const userId = req?.user?.id;

      if (!userId) {
        return res.status(401).json("Not authenticated!");
      }
      
      const user = await User.findOne({ userId });

      if (!user) {
        return res.status(404).json("User not found!");
      }

      let slug = req.body.title.replace(/ /g, "-").toLowerCase();
      let existingPost = await Post.findOne({ slug });
      let counter = 2;

      while (existingPost) {
        slug = `${slug}-${counter}`;
        existingPost = await Post.findOne({ slug });
        counter++;
      }

      const newPost = new Post({ user: userId , slug, ...req.body });
      const post = await newPost.save();
      // // Populate user data in the response
      // const populatedPost = await Post.findById(savedPost._id)
      //   .populate('user', 'username img roles');

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const userId = req?.user?.id;

      if (!userId) {
        return res.status(401).json("Not authenticated!");
      }

      const role = req?.user?.metadata?.role || "user";

      if (role === "admin") {
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json("Post has been deleted");
      }

      const user = await User.findOne({ userId });

      const deletedPost = await Post.findOneAndDelete({
        _id: req.params.id,
        user: user._id,
      });

      if (!deletedPost) {
        return res.status(403).json("You can delete only your posts!");
      }

      res.status(200).json("Post has been deleted");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  featurePost: async (req, res) => {
    try {
      const userId = req.user?.id;
      const postId = req.body.postId;

      if (!userId) {
        return res.status(401).json("Not authenticated!");
      }
      console.log(req.user) 
      const role = req.user?.roles || "user";

      if (!role.includes("admin")) {
        return res.status(403).json("You cannot feature posts!");
      }

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json("Post not found!");
      }

      const isFeatured = post.isFeatured;

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          isFeatured: !isFeatured,
        },
        { new: true }
      );

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  uploadAuth: async (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  },
};

module.exports = postController;
