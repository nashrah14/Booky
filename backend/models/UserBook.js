import mongoose from 'mongoose';

const userBookSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  status: {
    type: String,
    enum: ['read', 'currently_reading', 'want_to_read'],
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: null,
  },
  review: {
    type: String,
    default: '',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one entry per user-book combination
userBookSchema.index({ user_id: 1, book_id: 1 }, { unique: true });

export default mongoose.model('UserBook', userBookSchema);
