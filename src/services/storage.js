// Local storage service to replace Supabase
const STORAGE_KEYS = {
  USERS: 'booksy_users',
  BOOKS: 'booksy_books',
  USER_BOOKS: 'booksy_user_books',
  PROFILES: 'booksy_profiles',
  REVIEWS: 'booksy_reviews',
  LISTS: 'booksy_lists',
  LIST_BOOKS: 'booksy_list_books',
  SESSIONS: 'booksy_sessions',
};

// Initialize with sample data
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
    const sampleBooks = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81QuEGw8VPL.jpg',
        description: 'A classic American novel about the Jazz Age.',
        genres: ['Classics', 'Fiction'],
        average_rating: 4.5,
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81aY1lxk+9L.jpg',
        description: 'A gripping tale of racial injustice and childhood innocence.',
        genres: ['Classics', 'Fiction'],
        average_rating: 4.8,
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81StSOpmkjL.jpg',
        description: 'A dystopian social science fiction novel.',
        genres: ['Science Fiction', 'Dystopian'],
        average_rating: 4.7,
      },
      {
        id: '4',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupKjL.jpg',
        description: 'A romantic novel of manners.',
        genres: ['Romance', 'Classics'],
        average_rating: 4.6,
      },
      {
        id: '5',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/91HPG31dTwL.jpg',
        description: 'A controversial novel about teenage rebellion.',
        genres: ['Fiction', 'Classics'],
        average_rating: 4.3,
      },
      {
        id: '6',
        title: 'Lord of the Flies',
        author: 'William Golding',
        cover_url: 'https://images-na.ssl-images-amazon.com/images/I/81WUAoL-wFL.jpg',
        description: 'A story about a group of boys stranded on an island.',
        genres: ['Fiction', 'Adventure'],
        average_rating: 4.2,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(sampleBooks));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    // Add a demo user for easier local sign-in during development
    const demoUser = {
      id: `demo_${Date.now()}`,
      email: 'demo@booky.test',
      password: 'password', // demo credentials (dev only)
      user_metadata: { username: 'demo' },
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([demoUser]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USER_BOOKS)) {
    localStorage.setItem(STORAGE_KEYS.USER_BOOKS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    // Create a demo profile matching the demo user above
    const demoProfile = {
      id: `demo_${Date.now()}`,
      username: 'demo',
      bio: 'Demo account — explore Booky',
      profile_picture: null,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([demoProfile]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.LISTS)) {
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.LIST_BOOKS)) {
    localStorage.setItem(STORAGE_KEYS.LIST_BOOKS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(null));
  }
};

// Initialize on load
initializeData();

export const storage = {
  // Auth functions
  auth: {
    signUp: async (email, password, userData = {}) => {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        return { error: { message: 'User already exists' } };
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In real app, this would be hashed
        user_metadata: userData,
        created_at: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Create session
      const session = {
        user: newUser,
        access_token: `token_${Date.now()}`,
        expires_at: Date.now() + 86400000, // 24 hours
      };
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(session));
      
      // Create profile
      const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
      profiles.push({
        id: newUser.id,
        username: userData.username || email.split('@')[0],
        bio: 'Book lover 📚',
        profile_picture: null,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      
      return { data: { user: newUser, session }, error: null };
    },
    
    signIn: async (email, password) => {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { error: { message: 'Invalid email or password' } };
      }
      
      const session = {
        user,
        access_token: `token_${Date.now()}`,
        expires_at: Date.now() + 86400000,
      };
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(session));
      
      return { data: { user, session }, error: null };
    },
    
    signOut: async () => {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(null));
      return { error: null };
    },
    
    getSession: async () => {
      const sessionData = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (!sessionData || sessionData === 'null') {
        return { data: { session: null }, error: null };
      }
      
      const session = JSON.parse(sessionData);
      if (session.expires_at < Date.now()) {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(null));
        return { data: { session: null }, error: null };
      }
      
      return { data: { session }, error: null };
    },
    
    onAuthStateChange: (callback) => {
      // Simulate auth state changes
      const checkAuth = () => {
        const sessionData = localStorage.getItem(STORAGE_KEYS.SESSIONS);
        const session = sessionData && sessionData !== 'null' ? JSON.parse(sessionData) : null;
        callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
      };
      
      checkAuth();
      
      // Listen for storage changes
      const handleStorageChange = (e) => {
        if (e.key === STORAGE_KEYS.SESSIONS) {
          checkAuth();
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      
      return {
        data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handleStorageChange) } }
      };
    },
  },
  
  // Database functions
  from: (table) => {
    const getData = () => {
      const key = STORAGE_KEYS[table.toUpperCase()] || `booksy_${table}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    };
    
    const setData = (data) => {
      const key = STORAGE_KEYS[table.toUpperCase()] || `booksy_${table}`;
      localStorage.setItem(key, JSON.stringify(data));
    };
    
    return {
      select: (columns) => {
        const allData = getData();
        const basePromise = Promise.resolve({ data: allData, error: null });
        
        const query = {
          eq: (col, val) => {
            const filtered = allData.filter(d => d[col] === val);
            const filteredPromise = Promise.resolve({ data: filtered, error: null });
            
            return {
              single: async () => {
                const item = filtered[0];
                return { data: item || null, error: item ? null : { message: 'Not found' } };
              },
              order: (orderCol, options = {}) => {
                let sorted = [...filtered];
                
                if (orderCol) {
                  sorted.sort((a, b) => {
                    const aVal = a[orderCol];
                    const bVal = b[orderCol];
                    if (options.ascending) {
                      return aVal > bVal ? 1 : -1;
                    }
                    return aVal < bVal ? 1 : -1;
                  });
                }
                
                const sortedPromise = Promise.resolve({ data: sorted, error: null });
                return {
                  limit: async (limit) => {
                    return { data: sorted.slice(0, limit), error: null };
                  },
                  then: sortedPromise.then.bind(sortedPromise),
                  catch: sortedPromise.catch.bind(sortedPromise),
                };
              },
              limit: async (limit) => {
                return { data: filtered.slice(0, limit), error: null };
              },
              then: filteredPromise.then.bind(filteredPromise),
              catch: filteredPromise.catch.bind(filteredPromise),
            };
          },
          in: (col, values) => {
            return Promise.resolve({
              data: allData.filter(d => values.includes(d[col])),
              error: null
            });
          },
          order: (orderCol, options = {}) => {
            let sorted = [...allData];
            
            sorted.sort((a, b) => {
              const aVal = a[orderCol];
              const bVal = b[orderCol];
              if (options.ascending) {
                return aVal > bVal ? 1 : -1;
              }
              return aVal < bVal ? 1 : -1;
            });
            
            const sortedPromise = Promise.resolve({ data: sorted, error: null });
            
            return {
              limit: async (limit) => {
                return { data: sorted.slice(0, limit), error: null };
              },
              then: sortedPromise.then.bind(sortedPromise),
              catch: sortedPromise.catch.bind(sortedPromise),
            };
          },
          then: basePromise.then.bind(basePromise),
          catch: basePromise.catch.bind(basePromise),
        };
        
        return query;
      },
      
      insert: (newData) => {
        const data = getData();
        const newItem = {
          ...newData,
          id: newData.id || Date.now().toString(),
          created_at: newData.created_at || new Date().toISOString(),
        };
        data.push(newItem);
        setData(data);
        
        return {
          select: () => ({
            single: async () => {
              return { data: newItem, error: null };
            },
          }),
          then: (callback) => {
            return Promise.resolve({ data: newItem, error: null }).then(callback);
          },
        };
      },
      
      update: (updateData) => ({
        eq: (col, val) => {
          const data = getData();
          const index = data.findIndex(d => d[col] === val);
          let result;
          if (index !== -1) {
            data[index] = { ...data[index], ...updateData };
            setData(data);
            result = Promise.resolve({ data: data[index], error: null });
          } else {
            result = Promise.resolve({ data: null, error: { message: 'Not found' } });
          }
          return {
            then: result.then.bind(result),
            catch: result.catch.bind(result),
          };
        },
      }),
      
      upsert: async (upsertData) => {
        const data = getData();
        const key = table === 'user_books' ? ['user_id', 'book_id'] : 'id';
        
        let index = -1;
        if (Array.isArray(key)) {
          index = data.findIndex(d => 
            key.every(k => d[k] === upsertData[k])
          );
        } else {
          index = data.findIndex(d => d[key] === upsertData[key]);
        }
        
        const item = {
          ...upsertData,
          id: upsertData.id || (index !== -1 ? data[index].id : Date.now().toString()),
          created_at: upsertData.created_at || (index !== -1 ? data[index].created_at : new Date().toISOString()),
        };
        
        if (index !== -1) {
          data[index] = item;
        } else {
          data.push(item);
        }
        
        setData(data);
        return { data: item, error: null };
      },
    };
  },
};
