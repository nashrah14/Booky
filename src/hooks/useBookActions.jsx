import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';

export const useBookActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const addToBooks = async (bookId, status) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add books to your library.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await storage.from('user_books').upsert({
        user_id: user.id,
        book_id: bookId,
        status: status
      });

      toast({
        title: "Book added!",
        description: `Book added to your ${status.replace('_', ' ')} list.`
      });
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: "Error",
        description: "Failed to add book. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addReview = async (bookId, rating, reviewText) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to write reviews.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await storage.from('reviews').upsert({
        user_id: user.id,
        book_id: bookId,
        rating: rating,
        text: reviewText || null
      });

      toast({
        title: "Review added!",
        description: "Your review has been published."
      });
    } catch (error) {
      console.error('Error adding review:', error);
      toast({
        title: "Error",
        description: "Failed to add review. Please try again.",
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
