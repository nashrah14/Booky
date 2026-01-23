# Quick Start Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

## Step 1: Set Up MongoDB

### Option A: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Default connection: `mongodb://localhost:27017/booky`

### Option B: MongoDB Atlas (Cloud - Easier)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Use it in backend `.env`

## Step 2: Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/booky
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/booky?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB: mongodb://...
Server is running on port 3000
```

## Step 3: Frontend Setup

```bash
cd frontend
npm install
```

(Optional) Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Start frontend:
```bash
npm run dev
```

## Step 4: Test the Application

1. **Visit**: http://localhost:8080
2. **Sign Up**: Click "Sign In" → "Sign Up" tab
   - Create an account
   - You'll be automatically signed in
3. **View Books**: 
   - Homepage shows trending books
   - Discover page shows all 20 books
4. **Create Lists**: 
   - Go to /lists
   - Create a new book list

## Troubleshooting

### "Sign up failed" or "Sign in failed"
- **Check MongoDB connection**: Look at backend console for connection errors
- **Verify .env file**: Make sure MONGODB_URI is correct
- **Check backend is running**: Visit http://localhost:3000/api/health

### "No books found"
- Books auto-initialize on first request to /api/books
- Visit Discover page to trigger initialization
- Check backend console for errors

### MongoDB Connection Error
- Make sure MongoDB is running (local) or connection string is correct (Atlas)
- See MONGODB_SETUP.md for detailed instructions

## Features Working

✅ **Authentication**: Sign up and sign in with MongoDB
✅ **20 Popular Books**: Auto-initialized on first request
✅ **Trending Books**: Shows top 6 books on homepage
✅ **Discover Books**: Shows all books with search/filter
✅ **Lists**: Create and manage book lists
✅ **Search Bar Removed**: From navbar (search available on Discover page)
