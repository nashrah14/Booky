
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";


const getToken = () => localStorage.getItem("booky_token");
const setToken = (token) => localStorage.setItem("booky_token", token);
const clearToken = () => localStorage.removeItem("booky_token");

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: { message: data.error || "Request failed" },
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: "Backend not running (npm start in backend)",
      },
    };
  }
};

// ===============================
// API OBJECT
// ===============================
export const api = {
  // ===========================
  // AUTH
  // ===========================
  auth: {
    signUp: async (email, password, userData = {}) => {
      const res = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          username: userData.username,
        }),
      });

      if (!res.error && res.data?.token) {
        setToken(res.data.token);
      }

      return res;
    },

    signIn: async (email, password) => {
      const res = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!res.error && res.data?.token) {
        setToken(res.data.token);
      }

      return res;
    },

    signOut: async () => {
      clearToken();
      return { error: null };
    },

    getSession: async () => {
      const token = getToken();
      if (!token) return { data: null, error: null };
      return apiRequest("/users/me");
    },
  },


  books: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/books${query ? `?${query}` : ""}`);
    },

    getById: async (id) => apiRequest(`/books/${id}`),

    initialize: async () =>
      apiRequest("/books/initialize", { method: "POST" }),
  },

 
  users: {
    getById: async (id) => apiRequest(`/users/${id}`),

    update: async (id, data) =>
      apiRequest(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    getBooks: async (userId, status) => {
      const query = status ? `?status=${status}` : "";
      return apiRequest(`/users/${userId}/books${query}`);
    },

    addBook: async (userId, bookData) =>
      apiRequest(`/users/${userId}/books`, {
        method: "POST",
        body: JSON.stringify(bookData),
      }),
  },

  // ===========================
  // REVIEWS (👍 Likes + 💬 Replies)
  // ===========================
  reviews: {
    // Get reviews for a book
    getByBook: async (bookId) =>
      apiRequest(`/reviews/book/${bookId}`),

    // Create or update review
    create: async (reviewData) =>
      apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
      }),

    // 👍 Like / Unlike review
    like: async (reviewId) =>
      apiRequest(`/reviews/${reviewId}/like`, {
        method: "POST",
      }),

    // 💬 Add reply to a review
    reply: async (reviewId, text) =>
      apiRequest(`/reviews/${reviewId}/reply`, {
        method: "POST",
        body: JSON.stringify({ text }),
      }),

    // 📥 Get replies for a review
    getReplies: async (reviewId) =>
      apiRequest(`/reviews/${reviewId}/replies`),
  },

  // ===========================
  // LISTS
  // ===========================
  lists: {
    getAll: async () => apiRequest("/lists"),

    getByUser: async (userId) =>
      apiRequest(`/lists/user/${userId}`),

    create: async (listData) =>
      apiRequest("/lists", {
        method: "POST",
        body: JSON.stringify(listData),
      }),

    update: async (listId, listData) =>
      apiRequest(`/lists/${listId}`, {
        method: "PUT",
        body: JSON.stringify(listData),
      }),

    delete: async (listId) =>
      apiRequest(`/lists/${listId}`, { method: "DELETE" }),
  },
};
