# Quick Setup Guide

## 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/booky
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

Start MongoDB (if running locally):
- Windows: Make sure MongoDB service is running
- Mac/Linux: `mongod` or `brew services start mongodb-community`

Start the backend:
```bash
npm run dev
```

The backend will automatically initialize with 20 popular books on the first API request!

## 2. Frontend Setup

```bash
cd frontend
npm install
```

(Optional) Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:
```bash
npm run dev
```

## 3. Test Authentication

1. Go to `http://localhost:8080/auth`
2. Click "Sign Up" tab
3. Create an account with:
   - Username
   - Email
   - Password
4. You'll be automatically signed in after signup!

## 4. View Books

- **Homepage**: Shows trending books (top 6 by rating)
- **Discover Page**: Shows all 20 books with search and filter functionality
- **Search**: Use the search bar in the navbar to search for books

## Features Implemented

✅ **20 Popular Books** - Automatically loaded on first request
✅ **Trending Books Section** - Shows top 6 books by rating
✅ **Discover Books Section** - Shows all books with search and filters
✅ **Sign Up** - Create new account (auto-signs in)
✅ **Sign In** - Login with existing account
✅ **Authentication** - JWT-based authentication with MongoDB

## Troubleshooting

**Books not showing?**
- Make sure MongoDB is running
- Check backend console for errors
- Books auto-initialize on first GET request to `/api/books`

**Authentication not working?**
- Check backend is running on port 3000
- Check MongoDB connection
- Verify JWT_SECRET is set in backend `.env`

**Frontend can't connect to backend?**
- Verify backend is running: `http://localhost:3000/api/health`
- Check CORS settings (should be enabled)
- Verify `VITE_API_URL` in frontend `.env` matches backend URL
