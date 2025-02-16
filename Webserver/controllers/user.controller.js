const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
  try {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT secrets not configured");
    }

    const accessToken = jwt.sign(
      { id: user._id,
        roles: user.roles  },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw error;
  }
};

const userController = {
  getUserSavedPosts: async (req, res) => {
    try {
      const clerkUserId = req.auth.userId;

      if (!clerkUserId) {
        return res.status(401).json("Not authenticated!");
      }

      const user = await User.findOne({ clerkUserId });
      if (!user) {
        return res.status(404).json("User not found");
      }

      res.status(200).json(user.savedPosts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  savePost: async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = req.body.postId;

      if (!userId) {
        return res.status(401).json("Not authenticated!");
      }

      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json("User not found");
      }

      const isSaved = user.savedPosts.some((p) => p === postId);

      if (!isSaved) {
        await User.findByIdAndUpdate(user._id, {
          $push: { savedPosts: postId },
        });
      } else {
        await User.findByIdAndUpdate(user._id, {
          $pull: { savedPosts: postId },
        });
      }

      res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  registerUser: async (req, res) => {
    try {
      const { username, email, password, img } = req.body;

      const existingUser = await User.findOne({ 
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        return res.status(400).json("User already exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        img,
        roles: ['user'] // Default role
      });

      await newUser.save();
      
      const { password: _, ...userWithoutPassword } = newUser._doc;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log("Login attempt for:", email);
      console.log("Request headers:", req.headers);
      console.log("Origin:", req.headers.origin);

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json("User not found");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json("Invalid password");
      }

      console.log("Password verified for user:", user._id);

      try {
        // Generate tokens
        const tokens = generateTokens(user);
        console.log("Tokens generated:", {
          accessTokenLength: tokens.accessToken.length,
          refreshTokenLength: tokens.refreshToken.length
        });

        // Save refresh token to user
        user.refreshToken = tokens.refreshToken;
        await user.save();
        console.log("Refresh token saved to user");

        const cookieOptions = {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000
        };

        console.log('Setting cookie with options:', cookieOptions);
        
        // Set the new refresh token without clearing first
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
        console.log("Cookie has been set");

        // Remove sensitive data
        const { password: _, refreshToken: __, ...userWithoutSensitive } = user.toObject();
        
        console.log("Preparing response");
        const response = {
          accessToken: tokens.accessToken,
          ...userWithoutSensitive
        };
        
        console.log("Sending response with status 200");
        return res.status(200).json(response);
      } catch (tokenError) {
        console.error("Token generation failed:", tokenError);
        return res.status(500).json("Error generating tokens");
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json("No refresh token");
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Find user
      const user = await User.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json("Invalid refresh token");
      }

      // Generate new tokens
      const tokens = generateTokens(user);
      
      // Update refresh token in cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(403).json("Invalid refresh token");
    }
  },

  logout: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (refreshToken) {
        // Find user and remove refresh token
        await User.findOneAndUpdate(
          { refreshToken },
          { $unset: { refreshToken: "" } }
        );
      }

      // Clear refresh token cookie with same options
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        path: '/'
      });
      res.json("Logged out successfully");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password -savedPosts');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const userId = req.user.id; // From JWT token
      const user = await User.findById(userId)
        .select('-password -refreshToken -savedPosts');
      
      if (!user) {
        return res.status(404).json("User not found");
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { username, email, password, img, roles } = req.body;
      const userId = req.params.id;

      const updateData = { username, email, img , roles};

      // Only update password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json("User not found");
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json("User not found");
      }

      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;

