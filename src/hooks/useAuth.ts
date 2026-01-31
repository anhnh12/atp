import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in with Google';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign out';
      setError(errorMessage);
      throw err;
    }
  };

  const isAdmin = () => {
    // Check if user email is in admin list
    // For now, we'll check against environment variable or hardcoded list
    // You can enhance this later with Firestore admin collection
    if (!user?.email) return false;
    
    const adminEmails = process.env.REACT_APP_ADMIN_EMAILS?.split(',') || [];
    return adminEmails.includes(user.email);
  };

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    isAdmin: isAdmin(),
  };
};
