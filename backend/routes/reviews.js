import express from "express";
import Review from "../models/Review.js";
import Book from "../models/Book.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();


router.get("/book/:bookId", optionalAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ book_id: req.params.bookId })
      .populate("user_id", "username profile_picture")
      .populate("replies.user_id", "username profile_picture")
      .sort({ created_at: -1 });

    res.json({ data: reviews, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/", authenticate, async (req, res) => {
  try {
    const { book_id, rating, review_text } = req.body;

    if (!book_id || !rating) {
      return res.status(400).json({ error: "book_id and rating are required" });
    }

    const review = await Review.findOneAndUpdate(
      { user_id: req.user._id, book_id },
      { rating, review_text },
      { upsert: true, new: true }
    )
      .populate("user_id", "username profile_picture")
      .populate("replies.user_id", "username profile_picture");

    const reviews = await Review.find({ book_id });
    const total = reviews.length;
    const avg =
      total === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / total;

    await Book.findByIdAndUpdate(book_id, {
      average_rating: Number(avg.toFixed(1)),
      total_ratings: total
    });

    res.json({ data: review, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/:id/like", authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const userId = req.user._id.toString();
    const index = review.likes.findIndex(
      (id) => id.toString() === userId
    );

    if (index >= 0) {
      review.likes.splice(index, 1); // unlike
    } else {
      review.likes.push(req.user._id); // like
    }

    await review.save();

    res.json({
      data: {
        reviewId: review._id,
        likesCount: review.likes.length,
        liked: index === -1
      },
      error: null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 💬 ADD REPLY TO REVIEW
 */
router.post("/:id/reply", authenticate, async (req, res) => {
  try {
    const { reply_text } = req.body;

    if (!reply_text || !reply_text.trim()) {
      return res.status(400).json({ error: "Reply text is required" });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.replies.push({
      user_id: req.user._id,
      reply_text
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate("user_id", "username profile_picture")
      .populate("replies.user_id", "username profile_picture");

    res.json({ data: populatedReview, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
