# 📘 Booksy - Letterboxd for Books

**Booksy** is a full-stack web application inspired by Letterboxd, tailored for book lovers. It allows users to track their reading journey, rate and review books, build personalized book lists, follow other readers, and explore trending books - all in a modern, responsive interface.

---

## ✨ Features

- 📚 Track books as Read, Currently Reading, or Want to Read
- ⭐ Rate and review books
- 💬 Like and comment on others' reviews
- 📂 Create public or private book lists
- 👥 Follow users and view their reading activity
- 🔍 Search for books and users

---

## 🛠 Tech Stack

### Frontend
- React.js + JavaScript
- Tailwind CSS
- React Router
- React Query
- Vite

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm, yarn, or bun
- Docker & Docker Compose (for containerized setup)

### Installation

#### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Booksy-main
   ```

2. **Set up the Backend**

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/booksy
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3000`

3. **Set up the Frontend**

   Open a new terminal:
   ```bash
   cd frontend
   npm install
   ```

   Create a `.env` file in the `frontend` directory (optional, defaults to localhost:3000):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

   Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

4. **Initialize Sample Data**

   Once both servers are running, you can initialize sample books by making a POST request to:
   ```
   http://localhost:3000/api/books/initialize
   ```

   Or use curl:
   ```bash
   curl -X POST http://localhost:3000/api/books/initialize
   ```

#### Option 2: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Booksy-main
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build and start the frontend service on `http://localhost:5173`
   - Build and start the backend service on `http://localhost:3000`
   - Create MongoDB container with default configuration

3. **Environment Variables**

   The docker-compose.yml file handles most configuration. For custom settings, create `.env` files in `frontend/` and `backend/` directories.

---

## 📁 Project Structure

```
Booksy-main/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utilities and helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile              # Frontend container configuration
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
├── backend/                    # Express backend API
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── middleware/            # Express middleware
│   ├── scripts/               # Database initialization
│   ├── Dockerfile             # Backend container configuration
│   ├── server.js              # Entry point
│   └── package.json
│
├── docker-compose.yml         # Docker Compose orchestration
├── package.json               # Root package.json (if needed)
└── README.md
```

---

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and sent with each API request.

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new account
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

### Books
- `GET /api/books` - Get all books (with optional search, genre, sort params)
- `GET /api/books/:id` - Get a single book
- `POST /api/books` - Create a new book
- `POST /api/books/initialize` - Initialize with sample books

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/books` - Get user's books
- `POST /api/users/:id/books` - Add/update user book

### Reviews
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `POST /api/reviews` - Create or update review
- `POST /api/reviews/:id/like` - Like/unlike a review

### Lists
- `GET /api/lists` - Get all public lists
- `GET /api/lists/user/:userId` - Get user's lists
- `POST /api/lists` - Create a list
- `PUT /api/lists/:id` - Update a list
- `DELETE /api/lists/:id` - Delete a list

---

## 🎨 Features Implementation

### Search Functionality
- The search bar in the navbar allows users to search for books, authors, and users
- Search queries are passed to the Discover page via URL parameters
- The backend supports full-text search on book titles, authors, and descriptions

### Footer Background
- The footer now uses the same gradient background as the hero section: `bg-gradient-to-br from-amber-50 via-orange-50 to-red-50`

---

## 🐳 Docker & Deployment

### Running with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Backend Deployment

1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update the `MONGODB_URI` in your production `.env`
3. Build the Docker image:
   ```bash
   cd backend
   docker build -t booksy-backend .
   docker run -p 3000:3000 --env-file .env booksy-backend
   ```
4. Or deploy to services like Heroku, Railway, or Render

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to services like Vercel, Netlify, or GitHub Pages
3. Or build and run Docker image:
   ```bash
   cd frontend
   docker build -t booksy-frontend .
   docker run -p 5173:5173 booksy-frontend
   ```
4. Update `VITE_API_URL` to point to your production backend

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the MIT License.

---
