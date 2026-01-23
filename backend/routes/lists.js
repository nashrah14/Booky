import express from 'express';
import List from '../models/List.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all lists (public or user's own)
router.get('/', optionalAuth, async (req, res) => {
  try {
    let query = { is_public: true };
    
    if (req.user) {
      query = { $or: [{ is_public: true }, { user_id: req.user._id }] };
    }

    const lists = await List.find(query)
      .populate('user_id', 'username profile_picture')
      .populate('books')
      .sort({ created_at: -1 });

    res.json({ data: lists, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's lists
router.get('/user/:userId', optionalAuth, async (req, res) => {
  try {
    const lists = await List.find({ user_id: req.params.userId })
      .populate('books')
      .sort({ created_at: -1 });

    res.json({ data: lists, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create list
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    
    const list = new List({
      user_id: req.user._id,
      name,
      description,
      is_public: is_public !== undefined ? is_public : true,
    });

    await list.save();
    await list.populate('user_id', 'username profile_picture');
    
    res.status(201).json({ data: list, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update list
router.put('/:id', authenticate, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if (list.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, description, is_public, books } = req.body;
    list.name = name || list.name;
    list.description = description !== undefined ? description : list.description;
    list.is_public = is_public !== undefined ? is_public : list.is_public;
    list.books = books || list.books;
    list.updated_at = Date.now();

    await list.save();
    await list.populate('books');
    
    res.json({ data: list, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete list
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    if (list.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await List.findByIdAndDelete(req.params.id);
    res.json({ data: { message: 'List deleted' }, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
