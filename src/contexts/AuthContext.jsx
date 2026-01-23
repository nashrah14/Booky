import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/services/storage';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = storage.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    storage.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, userData = {}) => {
    const { data, error } = await storage.auth.signUp(email, password, userData);
    
    if (!error) {
      // Wait a moment for the user to be created
      setTimeout(async () => {
        const { error: signInError } = await storage.auth.signIn(email, password);
        if (signInError) {
          console.log('Auto sign-in after signup failed:', signInError);
        }
      }, 500);
    }
    
    return { error };
  };

  const signIn = async (email, password) => {
    const { error } = await storage.auth.signIn(email, password);
    if (!error) {
      // Update state
      const { data: { session } } = await storage.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    }
    return { error };
  };

  const signOut = async () => {
    await storage.auth.signOut();
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
