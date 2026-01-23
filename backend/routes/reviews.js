import express from 'express';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get reviews for a book
router.get('/book/:bookId', optionalAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ book_id: req.params.bookId })
      .populate('user_id', 'username profile_picture')
      .sort({ created_at: -1 });

    res.json({ data: reviews, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update review
router.post('/', authenticate, async (req, res) => {
  try {
    const { book_id, rating, review_text } = req.body;

    const review = await Review.findOneAndUpdate(
      { user_id: req.user._id, book_id },
      { rating, review_text, updated_at: Date.now() },
      { upsert: true, new: true }
    ).populate('user_id', 'username profile_picture');

    // Update book average rating
    const reviews = await Review.find({ book_id });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Book.findByIdAndUpdate(book_id, {
      average_rating: avgRating,
      total_ratings: reviews.length,
    });

    res.json({ data: review, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike review
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const userId = req.user._id.toString();
    const likeIndex = review.likes.findIndex(
      id => id.toString() === userId
    );

    if (likeIndex > -1) {
      review.likes.splice(likeIndex, 1);
    } else {
      review.likes.push(req.user._id);
    }

    await review.save();
    res.json({ data: review, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
