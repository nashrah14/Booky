// API service to communicate with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getToken = () => {
  const sessionData = localStorage.getItem('booksy_sessions');
  if (!sessionData || sessionData === 'null') return null;
  try {
    const session = JSON.parse(sessionData);
    return session?.access_token || session?.session?.access_token;
  } catch {
    return null;
  }
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
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
      // Handle different error formats
      const errorMessage = typeof data.error === 'string' 
        ? data.error 
        : data.error?.message || data.message || 'Request failed';
      return { error: { message: errorMessage }, data: null };
    }

    return { data, error: null };
  } catch (error) {
    return { error: { message: error.message }, data: null };
  }
};

export const api = {
  // Auth functions
  auth: {
    signUp: async (email, password, userData = {}) => {
      const result = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, username: userData.username }),
      });

      if (!result.error && result.data?.data) {
        // Store session in localStorage for compatibility
        const session = {
          user: result.data.data.user,
          access_token: result.data.data.session.access_token,
          expires_at: result.data.data.session.expires_at,
        };
        localStorage.setItem('booksy_sessions', JSON.stringify(session));
      }

      return result;
    },

    signIn: async (email, password) => {
      const result = await apiRequest('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!result.error && result.data?.data) {
        // Store session in localStorage for compatibility
        const session = {
          user: result.data.data.user,
          access_token: result.data.data.session.access_token,
          expires_at: result.data.data.session.expires_at,
        };
        localStorage.setItem('booksy_sessions', JSON.stringify(session));
      }

      return result;
    },

    signOut: async () => {
      localStorage.setItem('booksy_sessions', JSON.stringify(null));
      return { error: null };
    },

    getSession: async () => {
      const token = getToken();
      if (!token) {
        return { data: { session: null }, error: null };
      }

      const result = await apiRequest('/auth/session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.error && result.data?.data?.session) {
        // Update stored session
        const session = {
          user: result.data.data.session.user,
          access_token: token,
        };
        localStorage.setItem('booksy_sessions', JSON.stringify(session));
        return { data: { session }, error: null };
      }

      // If session is invalid, clear it
      localStorage.setItem('booksy_sessions', JSON.stringify(null));
      return { data: { session: null }, error: null };
    },

    onAuthStateChange: (callback) => {
      const checkAuth = async () => {
        const { data } = await api.auth.getSession();
        callback(data.session ? 'SIGNED_IN' : 'SIGNED_OUT', data.session);
      };

      checkAuth();

      // Listen for storage changes
      const handleStorageChange = (e) => {
        if (e.key === 'booksy_sessions') {
          checkAuth();
        }
      };

      window.addEventListener('storage', handleStorageChange);

      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener('storage', handleStorageChange),
          },
        },
      };
    },
  },

  // Books
  books: {
    getAll: async (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.genre) queryParams.append('genre', params.genre);
      if (params.sort) queryParams.append('sort', params.sort);

      const queryString = queryParams.toString();
      return apiRequest(`/books${queryString ? `?${queryString}` : ''}`);
    },

    getById: async (id) => {
      return apiRequest(`/books/${id}`);
    },

    initialize: async () => {
      return apiRequest('/books/initialize', { method: 'POST' });
    },
  },

  // Users
  users: {
    getById: async (id) => {
      return apiRequest(`/users/${id}`);
    },

    update: async (id, data) => {
      return apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    getBooks: async (userId, status) => {
      // Handle both string IDs and MongoDB _id objects
      const id = userId?._id || userId?.id || userId;
      const queryParams = status ? `?status=${status}` : '';
      return apiRequest(`/users/${id}/books${queryParams}`);
    },

    addBook: async (userId, bookData) => {
      // Handle both string IDs and MongoDB _id objects
      const id = userId?._id || userId?.id || userId;
      return apiRequest(`/users/${id}/books`, {
        method: 'POST',
        body: JSON.stringify(bookData),
      });
    },
  },

  // Reviews
  reviews: {
    getByBook: async (bookId) => {
      return apiRequest(`/reviews/book/${bookId}`);
    },

    create: async (reviewData) => {
      return apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    },

    like: async (reviewId) => {
      return apiRequest(`/reviews/${reviewId}/like`, {
        method: 'POST',
      });
    },
  },

  // Lists
  lists: {
    getAll: async () => {
      return apiRequest('/lists');
    },

    getByUser: async (userId) => {
      return apiRequest(`/lists/user/${userId}`);
    },

    create: async (listData) => {
      return apiRequest('/lists', {
        method: 'POST',
        body: JSON.stringify(listData),
      });
    },

    update: async (listId, listData) => {
      return apiRequest(`/lists/${listId}`, {
        method: 'PUT',
        body: JSON.stringify(listData),
      });
    },

    delete: async (listId) => {
      return apiRequest(`/lists/${listId}`, {
        method: 'DELETE',
      });
    },
  },
};

// Compatibility layer for existing storage.js usage
export const storage = {
  auth: api.auth,
  from: (table) => {
    // Map table names to API endpoints
    const tableMap = {
      books: api.books,
      users: api.users,
      reviews: api.reviews,
      lists: api.lists,
    };

    const apiService = tableMap[table];
    if (!apiService) {
      return {
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        upsert: () => Promise.resolve({ data: null, error: null }),
      };
    }

    // Return a compatible interface
    return {
      select: (columns) => {
        if (table === 'books') {
          return {
            then: (callback) => {
              return api.books.getAll().then((result) => {
                if (callback) {
                  return callback(result);
                }
                return result;
              });
            },
            catch: (callback) => {
              return api.books.getAll().catch(callback);
            },
          };
        }
        return Promise.resolve({ data: [], error: null });
      },
      insert: (newData) => {
        if (table === 'books') {
          return {
            select: () => ({
              single: async () => api.books.getById(newData.id),
            }),
            then: (callback) => {
              return api.books.getAll().then(callback);
            },
          };
        }
        return Promise.resolve({ data: newData, error: null });
      },
      update: (updateData) => ({
        eq: (col, val) => ({
          then: (callback) => Promise.resolve({ data: null, error: null }).then(callback),
          catch: (callback) => Promise.resolve({ data: null, error: null }).catch(callback),
        }),
      }),
      upsert: async (upsertData) => {
      if (table === 'user_books') {
        const userId = upsertData.user_id?._id || upsertData.user_id?.id || upsertData.user_id || upsertData.userId?._id || upsertData.userId?.id || upsertData.userId;
        const bookId = upsertData.book_id?._id || upsertData.book_id?.id || upsertData.book_id || upsertData.bookId?._id || upsertData.bookId?.id || upsertData.bookId;
        return api.users.addBook(userId, {
          book_id: bookId,
          status: upsertData.status,
          rating: upsertData.rating,
          review: upsertData.review,
        });
      }
        return { data: upsertData, error: null };
      },
    };
  },
};
