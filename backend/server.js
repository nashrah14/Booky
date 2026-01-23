import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';
import listRoutes from './routes/lists.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booky';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB:', MONGODB_URI);
  
  // Auto-initialize books if database is empty
  try {
    const Book = (await import('./models/Book.js')).default;
    const count = await Book.countDocuments();
    if (count === 0) {
      console.log('📚 No books found. Books will be initialized on first API request to /api/books');
    } else {
      console.log(`📚 Database has ${count} books.`);
    }
  } catch (error) {
    console.log('⚠️  Could not check book count:', error.message);
  }
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.error('💡 Make sure MongoDB is running. You can:');
  console.error('   1. Install MongoDB locally and start it');
  console.error('   2. Use MongoDB Atlas (cloud) and update MONGODB_URI in .env');
  console.error('   3. For local: mongodb://localhost:27017/booky');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/lists', listRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Booky API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
