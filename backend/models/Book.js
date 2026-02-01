import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true,
      trim: true
    },

    cover_url: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: ""
    },

    genres: [
      {
        type: String,
        trim: true
      }
    ],

    average_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    total_ratings: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

bookSchema.index({
  title: "text",
  author: "text",
  description: "text"
});

export default mongoose.model("Book", bookSchema);
