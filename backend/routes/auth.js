import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({
      email,
      password,
      username: username || email.split('@')[0],
    });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          bio: user.bio,
          profile_picture: user.profile_picture,
          created_at: user.created_at,
        },
        session: {
          access_token: token,
          expires_at: Date.now() + 24 * 60 * 60 * 1000,
        },
      },
      error: null,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    // Handle duplicate key error (MongoDB)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    res.status(500).json({ error: error.message || 'Failed to create account' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          bio: user.bio,
          profile_picture: user.profile_picture,
          created_at: user.created_at,
        },
        session: {
          access_token: token,
          expires_at: Date.now() + 24 * 60 * 60 * 1000,
        },
      },
      error: null,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: error.message || 'Failed to sign in' });
  }
});

// Get session
router.get('/session', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.json({ data: { session: null }, error: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.json({ data: { session: null }, error: null });
    }

    res.json({
      data: {
        session: {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profile_picture: user.profile_picture,
            created_at: user.created_at,
          },
          access_token: token,
        },
      },
      error: null,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: error.message || 'Failed to sign in' });
  }
});

// Sign out (client-side token removal, but we can log it)
router.post('/signout', (req, res) => {
  res.json({ error: null });
});

export default router;
