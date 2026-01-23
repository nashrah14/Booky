import express from 'express';
import User from '../models/User.js';
import UserBook from '../models/UserBook.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: user, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { username, bio, profile_picture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, bio, profile_picture, updated_at: Date.now() },
      { new: true }
    ).select('-password');

    res.json({ data: user, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's books
router.get('/:id/books', async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user_id: req.params.id };
    
    if (status) {
      query.status = status;
    }

    const userBooks = await UserBook.find(query)
      .populate('book_id')
      .sort({ updated_at: -1 });

    res.json({ data: userBooks, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add/Update user book
router.post('/:id/books', authenticate, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { book_id, status, rating, review } = req.body;
    
    const userBook = await UserBook.findOneAndUpdate(
      { user_id: req.params.id, book_id },
      { status, rating, review, updated_at: Date.now() },
      { upsert: true, new: true }
    ).populate('book_id');

    res.json({ data: userBook, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
