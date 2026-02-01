import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { BookCard } from '@/components/BookCard';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/InlineComponents';
import { BookOpen, BookMarked, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_USER_BOOKS } from '@/data/dummyData';

const MyBooks = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('currently_reading');

  /* ------------------ Redirect if not logged in ------------------ */
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  /* ------------------ Fetch books when user is ready ------------------ */
  useEffect(() => {
    if (!user?.id && !user?._id) return;

    const fetchUserBooks = async () => {
      try {
        setLoading(true);
        const userId = user._id || user.id;
        const result = await api.users.getBooks(userId);

        if (result.data?.data?.length > 0) {
          const mappedBooks = result.data.data.map(userBook => ({
            id: userBook._id || userBook.id,
            status: userBook.status,
            book_id: userBook.book_id?._id || userBook.book_id?.id || userBook.book_id,
            book: {
              id: userBook.book_id?._id || userBook.book_id?.id || userBook.book_id,
              title: userBook.book_id?.title || 'Unknown',
              author: userBook.book_id?.author || 'Unknown',
              cover_url: userBook.book_id?.cover_url || '',
              average_rating: userBook.book_id?.average_rating || 0
            }
          }));

          setUserBooks(mappedBooks);
        } else {
          setUserBooks(DUMMY_USER_BOOKS);
        }
      } catch (error) {
        console.error('Error fetching user books:', error);
        setUserBooks(DUMMY_USER_BOOKS);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, [user]);

  /* ------------------ Helpers ------------------ */
  const getBooksByStatus = status =>
    userBooks.filter(book => book.status === status);

  const getStatusCount = status =>
    getBooksByStatus(status).length;

  /* ------------------ Loader ------------------ */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your books...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Books</h1>
          <p className="text-xl text-gray-600">Track your reading journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<BookOpen />} count={getStatusCount('currently_reading') + getStatusCount('reading')} label="Currently Reading" />
          <StatCard icon={<BookMarked />} count={getStatusCount('want_to_read')} label="Want to Read" />
          <StatCard icon={<CheckCircle />} count={getStatusCount('read')} label="Books Read" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="currently_reading">Reading</TabsTrigger>
              <TabsTrigger value="want_to_read">Want to Read</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            {['currently_reading', 'want_to_read', 'read'].map(status => (
              <TabsContent key={status} value={status} className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getBooksByStatus(status).map(userBook => (
                    <BookCard
                      key={userBook.id}
                      book={{
                        id: userBook.book?.id,
                        title: userBook.book?.title,
                        author: userBook.book?.author,
                        rating: userBook.book?.average_rating,
                        cover: userBook.book?.cover_url || 'https://via.placeholder.com/300x400?text=No+Cover',
                        status
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

/* ------------------ Small stat component ------------------ */
const StatCard = ({ icon, count, label }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  </div>
);

export default MyBooks;
