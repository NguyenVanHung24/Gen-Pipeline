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

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors(process.env.CLIENT_URL));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  
app.use('/uploads', express.static('uploads'));
app.use('/api', apiRoutes);
app.use('/api/posts', postRoute);
app.use('/api/users', useRoute);
app.use('/api/comments',useComments)


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