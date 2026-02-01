import express from "express";
import Book from "../models/Book.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();


router.get("/", optionalAuth, async (req, res) => {
  try {

    const count = await Book.countDocuments();
    if (count === 0) {
      console.log("Auto-initializing books...");

      const sampleBooks = [
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          cover_url:
            "https://images-na.ssl-images-amazon.com/images/I/81QuEGw8VPL.jpg",
          description:
            "A classic American novel about the Jazz Age and the mysterious Jay Gatsby.",
          genres: ["Classics", "Fiction"],
          average_rating: 4.5,
          total_ratings: 1250
        },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          cover_url:
            "https://images-na.ssl-images-amazon.com/images/I/81aY1lxk+9L.jpg",
          description:
            "A gripping tale of racial injustice and childhood innocence.",
          genres: ["Classics", "Fiction"],
          average_rating: 4.8,
          total_ratings: 2100
        },
        {
          title: "1984",
          author: "George Orwell",
          cover_url:
            "https://images-na.ssl-images-amazon.com/images/I/81StSOpmkjL.jpg",
          description:
            "A dystopian novel about totalitarian surveillance and control.",
          genres: ["Science Fiction", "Dystopian"],
          average_rating: 4.7,
          total_ratings: 1800
        },
        {
          title: "Harry Potter and the Sorcerer's Stone",
          author: "J.K. Rowling",
          cover_url:
            "https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg",
          description:
            "The first book in the Harry Potter series.",
          genres: ["Fantasy", "Young Adult"],
          average_rating: 4.9,
          total_ratings: 3500
        },
        {
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          cover_url:
            "https://images-na.ssl-images-amazon.com/images/I/712cDO7d73L.jpg",
          description:
            "A fantasy adventure about Bilbo Baggins.",
          genres: ["Fantasy", "Adventure"],
          average_rating: 4.7,
          total_ratings: 2200
        }
      ];

      await Book.insertMany(sampleBooks);
      console.log(`Initialized ${sampleBooks.length} books`);
    }

    // 🔹 Query params
    const { search, genre, sort = "title" } = req.query;
    let query = {};

    // 🔍 Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // 🏷️ Genre filter
    if (genre && genre !== "all") {
      query.genres = genre;
    }

    // 🔃 Sorting
    let sortOption = {};
    switch (sort) {
      case "rating":
        sortOption = { average_rating: -1 };
        break;
      case "author":
        sortOption = { author: 1 };
        break;
      default:
        sortOption = { title: 1 };
    }

    const books = await Book.find(query).sort(sortOption);

    res.json({
      data: books,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ data: book, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ data: book, error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
