import React, { useState, useEffect } from 'react';
import { BookCard } from './BookCard';
import { api } from '@/services/api';
import { Button } from '@/components/InlineComponents';
import { useNavigate } from 'react-router-dom';

export const BookGrid = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingBooks();
  }, []);

  const fetchTrendingBooks = async () => {
    try {
      const result = await api.books.getAll({ sort: 'rating' });
      if (result.data?.data) {
        // Get top 6 books by rating and convert _id to id
        const topBooks = result.data.data
          .slice(0, 6)
          .map(book => ({
            ...book,
            id: book._id || book.id
          }));
        setBooks(topBooks);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Books</h2>
            <p className="text-xl text-gray-600">Discover what the community is reading right now</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="w-full h-80 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Books</h2>
          <p className="text-xl text-gray-600">Discover what the community is reading right now</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard 
              key={book.id || book._id} 
              book={{
                id: book.id || book._id,
                title: book.title,
                author: book.author,
                rating: book.average_rating,
                reviews: 0,
                cover: book.cover_url,
                status: 'trending'
              }} 
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            onClick={() => navigate('/discover')}
          >
            View All Books
          </Button>
        </div>
      </div>
    </section>
  );
};
