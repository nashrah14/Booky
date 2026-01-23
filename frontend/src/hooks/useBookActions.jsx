import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useBookActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addToBooks = async (bookId, status) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add books to your library.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await api.users.addBook(user.id, {
        book_id: bookId,
        status: status
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to add book');
      }

      toast({
        title: "Book added!",
        description: `Book added to your ${status.replace('_', ' ')} list.`
      });
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add book. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (bookId, rating, reviewText) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to write reviews.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await api.reviews.create({
        book_id: bookId,
        rating: rating,
        review_text: reviewText || ''
      });

      if (result.error) {
        throw new Error(result.error.message || 'Failed to add review');
      }

      toast({
        title: "Review added!",
        description: "Your review has been published."
      });
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    addToBooks,
    addReview,
    loading
  };
};
