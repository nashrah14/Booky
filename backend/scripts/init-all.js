
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/Book.js";
import User from "../models/User.js";

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
    description: "A story about a group of boys stranded on an island.",
    genres: ["Fiction", "Adventure"],
    average_rating: 4.2
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover_url:
      "https://images-na.ssl-images-amazon.com/images/I/81g6BKT75HL.jpg",
    description:
      "An adventure fantasy novel about Bilbo Baggins.",
    genres: ["Fantasy", "Adventure"],
    average_rating: 4.7
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    cover_url:
      "https://images-na.ssl-images-amazon.com/images/I/91T0y7gTL8L.jpg",
    description:
      "A dystopian novel about a televised death match.",
    genres: ["Science Fiction", "Young Adult"],
    average_rating: 4.5
  }
];

const testUsers = [
  {
    email: "testuser@example.com",
    password: "testPassword123",
    username: "testuser",
    bio: "A passionate book reader exploring the world of literature."
  },
  {
    email: "demo@booksy.com",
    password: "demo123456",
    username: "demouser",
    bio: "Testing out Booky with various books."
  },
  {
    email: "admin@booksy.com",
    password: "admin123456",
    username: "admin",
    bio: "Admin user for testing and management."
  }
];


async function initializeDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB:", MONGODB_URI);

    // 📚 Initialize books
    console.log("\n📚 Initializing books...");
    const existingBooks = await Book.countDocuments();

    if (existingBooks === 0) {
      await Book.insertMany(sampleBooks);
      console.log(
        `✅ Successfully added ${sampleBooks.length} sample books.`
      );
    } else {
      console.log(
        `ℹ️  Database already has ${existingBooks} books. Skipping.`
      );
    }

    // 👤 Initialize test users
    console.log("\n👤 Initializing test users...");
    for (const testUser of testUsers) {
      const exists = await User.findOne({ email: testUser.email });

      if (!exists) {
        // ⚠️ Password hashing handled by User model
        await User.create(testUser);
        console.log(`✅ Created test user: ${testUser.email}`);
      } else {
        console.log(`ℹ️  User ${testUser.email} already exists.`);
      }
    }

    console.log("\n✅ Database initialization complete!");
    console.log("\n🔐 Test Credentials:");
    console.log("───────────────────────────────────────────");
    testUsers.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log("───────────────────────────────────────────");
    });

    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    process.exit(1);
  }
}

initializeDatabase();
