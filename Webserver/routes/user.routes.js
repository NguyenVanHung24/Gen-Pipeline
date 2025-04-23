const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth');

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
router.get('/', verifyToken, userController.getAllUsers);
router.get('/saved', verifyToken, userController.getUserSavedPosts);
router.patch('/save', verifyToken, userController.savePost);
router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.get('/me', verifyToken, userController.getCurrentUser);

module.exports = router;