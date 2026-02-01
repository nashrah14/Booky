
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/Book.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booky";


const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover_url:
      "https://images-na.ssl-images-amazon.com/images/I/81QuEGw8VPL.jpg",
    description: "A classic American novel about the Jazz Age.",
    genres: ["Classics", "Fiction"],
    average_rating: 4.5
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover_url:
      "https://images-na.ssl-images-amazon.com/images/I/81aY1lxk+9L.jpg",
    description:
      "A gripping tale of racial injustice and childhood innocence.",
    genres: ["Classics", "Fiction"],
    average_rating: 4.8
  },
  {
    title: "1984",
    author: "George Orwell",
    cover_url:
      "https://images-na.ssl-images-amazon.com/images/I/81StSOpmkjL.jpg",
    description: "A dystopian social science fiction novel.",
    genres: ["Science Fiction", "Dystopian"],
    average_rating: 4.7
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover_url:
      "https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg",
    description: "A romantic novel of manners.",
    genres: ["Romance", "Classics"],
    average_rating: 4.6
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover_url:
      "https://images-na.ssl-images-amazon.com/images/I/91HPG31dTwL.jpg",
    description: "A controversial novel about teenage rebellion.",
    genres: ["Fiction", "Classics"],
    average_rating: 4.3
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    cover_url:
      "https://images-na.ssl-images-amazon.com/images/I/81WUAoL-wFL.jpg",
    description:
      "A story about a group of boys stranded on an island.",
    genres: ["Fiction", "Adventure"],
    average_rating: 4.2
  }
];


async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB:", MONGODB_URI);

    const existingBooks = await Book.countDocuments();

    if (existingBooks > 0) {
      console.log(
        `ℹ️  Database already has ${existingBooks} books. Skipping initialization.`
      );
    } else {
      await Book.insertMany(sampleBooks);
      console.log(
        `✅ Successfully inserted ${sampleBooks.length} sample books.`
      );
    }

    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    process.exit(1);
  }
}

initializeDatabase();
