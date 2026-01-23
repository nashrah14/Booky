import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = api.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    api.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await api.auth.signUp(email, password, userData);
      
      if (error) {
        return { error };
      }
      
      if (data?.data) {
        // Auto sign in after signup - store session and update state
        const session = {
          user: data.data.user,
          access_token: data.data.session.access_token,
          expires_at: data.data.session.expires_at,
        };
        localStorage.setItem('booksy_sessions', JSON.stringify(session));
        setSession(session);
        setUser(session.user);
        return { error: null };
      }
      
      return { error: { message: 'Unexpected response format' } };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: { message: err.message || 'Failed to sign up' } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await api.auth.signIn(email, password);
      
      if (error) {
        return { error };
      }
      
      if (data?.data) {
        // Update state with session from sign in response
        const session = {
          user: data.data.user,
          access_token: data.data.session.access_token,
          expires_at: data.data.session.expires_at,
        };
        localStorage.setItem('booksy_sessions', JSON.stringify(session));
        setSession(session);
        setUser(session.user);
        return { error: null };
      }
      
      return { error: { message: 'Unexpected response format' } };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: { message: err.message || 'Failed to sign in' } };
    }
  };

  const signOut = async () => {
    await api.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
