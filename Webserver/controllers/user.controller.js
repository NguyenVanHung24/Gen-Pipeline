const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        // For security reasons, don't reveal if the email exists or not
        return res.status(200).json({ message: "If your email is registered, you will receive a password reset link" });
      }

      // Generate random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Hash token before saving to database
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      
      // Set token and expiration (valid for 1 hour)
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      
      await user.save();

      // Create reset URL
      const resetUrl = `${process.env.CLIENT_URL}/blog/reset-password/${resetToken}`;

      // For testing purposes, create a test account using Ethereal
      let testAccount = await nodemailer.createTestAccount();
      
      // Configure nodemailer transporter
      let transporter;
      
      // Use Ethereal for testing or Gmail based on environment
      if (process.env.NODE_ENV === 'development') {
        console.log('Using Ethereal Mail for testing');
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      } else {
        console.log('Using configured mail service:', process.env.EMAIL_SERVICE);
        transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });
      }

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@yourapp.com',
        to: user.email,
        subject: 'Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #3b82f6;">Password Reset Request</h2>
            <p>Hello ${user.username},</p>
            <p>You recently requested to reset your password. Please click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link is valid for 1 hour.</p>
            <p>Best regards,<br/>Your App Team</p>
          </div>
        `
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      
      // Log email info
      console.log('Email sent successfully to:', user.email);
      
      // If using Ethereal, provide the preview URL
      if (process.env.NODE_ENV === 'development') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  verifyResetToken: async (req, res) => {
    try {
      const token = req.params.token;

      // Hash the token from URL
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find user with matching token and valid expiration
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired password reset token" });
      }

      res.status(200).json({ message: "Token is valid" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const token = req.params.token;
      
      if (!password) {
        return res.status(400).json({ error: "Password is required" });
      }

      // Hash the token from URL
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Find user with matching token and valid expiration
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired password reset token" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user's password and remove reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;

