require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config');
// const postRoutes = require('./routes/post.routes');
// const authRoutes = require('./routes/auth.routes');
// const commentRoutes = require('./routes/comment.routes');
const blogRoutes = require('./routes/blog.routes');
const apiRoutes = require('./routes/api.routes');
const postRoute = require('./routes/post.routes');
const useRoute = require('./routes/user.routes');
const useComments = require('./routes/comment.routes')
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
// Middleware
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Set-Cookie'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());

// Add middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  console.log('Request cookies:', req.cookies);
  next();
});

app.use('/uploads', express.static('uploads'));
app.use('/api', apiRoutes);
app.use('/api/posts', postRoute);
app.use('/api/users', useRoute);
app.use('/api/comments',useComments)
// Add a test endpoint to verify CORS
app.get('/api/test-cors', (req, res) => {
  console.log('Test CORS endpoint hit');
  console.log('Cookies received:', req.cookies);
  console.log('Origin:', req.headers.origin);
  
  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
  
  console.log('Setting cookie with options:', cookieOptions);
  
  res.cookie('refreshToken', "h2334ungvv", cookieOptions);
  console.log('Cookie set in test endpoint');
  
  res.json({ message: 'CORS is working!' });
});

// Connect to MongoDB
connectDB();

// // Routes
// app.use('/api/posts', postRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/comments', commentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});