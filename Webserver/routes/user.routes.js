const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', userController.logout);

// Password reset routes
router.post('/forgot-password', userController.forgotPassword);
router.get('/reset-password/:token', userController.verifyResetToken);
router.post('/reset-password/:token', userController.resetPassword);

// Protected routes
router.get('/', verifyAdmin, userController.getAllUsers);
router.get('/saved', verifyAdmin, userController.getUserSavedPosts);
router.patch('/save', verifyAdmin, userController.savePost);
router.put('/:id', verifyAdmin, userController.updateUser);
router.delete('/:id', verifyAdmin, userController.deleteUser);
router.get('/me', verifyAdmin, userController.getCurrentUser);

module.exports = router;