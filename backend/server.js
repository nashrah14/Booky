import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";
import listRoutes from "./routes/lists.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/booky";


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected:", MONGODB_URI);

    try {
      const Book = (await import("./models/Book.js")).default;
      const count = await Book.countDocuments();

      if (count === 0) {
        console.log(
          "📚 No books found. They will be auto-initialized on first /api/books request."
        );
      } else {
        console.log(`📚 Database already contains ${count} books.`);
      }
    } catch (err) {
      console.warn("⚠️ Could not verify books collection:", err.message);
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stop server if DB fails
  });

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/lists", listRoutes);


app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Booky API is running 🚀"
  });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
