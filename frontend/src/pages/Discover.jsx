import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import { WorkingBookCard } from '@/components/WorkingBookCard';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/InlineComponents';
import { Search, BookOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DUMMY_BOOKS } from '@/data/dummyData';

const Discover = () => {
  const [searchParams] = useSearchParams();

  const [allBooks, setAllBooks] = useState([]);
  const [books, setBooks] = useState([]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [loading, setLoading] = useState(true);

  const debounceTimer = useRef(null);

  // 🔹 Fetch ALL books once
  useEffect(() => {
    fetchBooks();
  }, []);

  // 🔹 Apply filters when search / genre / sort changes
  useEffect(() => {
    if (!allBooks.length) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, selectedGenre, sortBy, allBooks]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const result = await api.books.getAll();

      const data =
        result.data?.data && Array.isArray(result.data.data)
          ? result.data.data.map((b) => ({ ...b, id: b._id || b.id }))
          : DUMMY_BOOKS;

      setAllBooks(data);
      setBooks(data);
    } catch (err) {
      console.error('Book fetch failed, using dummy data');
      setAllBooks(DUMMY_BOOKS);
      setBooks(DUMMY_BOOKS);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Frontend filtering logic
  const applyFilters = () => {
    let filtered = [...allBooks];

    // 🔍 Search by title OR author
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(term) ||
          book.author?.toLowerCase().includes(term)
      );
    }

    // 🎭 Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter((book) =>
        book.genres?.includes(selectedGenre)
      );
    }

    // 🔃 Sorting
    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      filtered.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'rating') {
      filtered.sort(
        (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
      );
    }

    setBooks(filtered);
  };

  const getAllGenres = () => {
    const genres = new Set();
    allBooks.forEach((b) => b.genres?.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-3 sm:px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Discover Books
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Find your next great read
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8 sm:mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by title or author..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {getAllGenres().map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.length ? (
            books.map((book) => (
              <WorkingBookCard
                key={book.id}
                book={{
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  rating: book.average_rating || 0,
                  cover:
                    book.cover_url ||
                    'https://via.placeholder.com/300x400?text=No+Cover',
                  genres: book.genres || [],
                  description: book.description || '',
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                No books found. Try adjusting your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
