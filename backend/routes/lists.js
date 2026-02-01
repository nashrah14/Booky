import express from "express";
import List from "../models/List.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = express.Router();


router.get("/", optionalAuth, async (req, res) => {
  try {
    const query = req.user
      ? { $or: [{ is_public: true }, { user_id: req.user._id }] }
      : { is_public: true };

    const lists = await List.find(query)
      .populate("user_id", "username profile_picture")
      .populate("books")
      .sort({ created_at: -1 });

    res.json({ data: lists, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/user/:userId", optionalAuth, async (req, res) => {
  try {
    const isOwner = req.user && req.user._id.toString() === req.params.userId;

    const query = isOwner
      ? { user_id: req.params.userId }
      : { user_id: req.params.userId, is_public: true };

    const lists = await List.find(query)
      .populate("books")
      .sort({ created_at: -1 });

    res.json({ data: lists, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/", authenticate, async (req, res) => {
  try {
    const { name, description, is_public } = req.body;

    if (!name) {
      return res.status(400).json({ error: "List name is required" });
    }

    const list = await List.create({
      user_id: req.user._id,
      name,
      description,
      is_public: is_public ?? true
    });

    await list.populate("user_id", "username profile_picture");

    res.status(201).json({ data: list, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", authenticate, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    if (list.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { name, description, is_public, books } = req.body;

    if (name !== undefined) list.name = name;
    if (description !== undefined) list.description = description;
    if (is_public !== undefined) list.is_public = is_public;
    if (Array.isArray(books)) list.books = books;

    await list.save();
    await list.populate("books");

    res.json({ data: list, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:id", authenticate, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    if (list.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await list.deleteOne();

    res.json({
      data: { message: "List deleted successfully" },
      error: null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
