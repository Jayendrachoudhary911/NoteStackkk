import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            const fallbackProfile = {
              uid: user.uid,
              email: user.email,
              username: user.email ? user.email.split('@')[0] : 'user',
              fullName: user.displayName || 'NoteStack User',
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, fallbackProfile);
            setUserProfile(fallbackProfile);
          }
        } catch (e) {
          console.error('Failed to fetch user profile:', e);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, username, fullName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: fullName });
    const userProfileData = {
      uid: res.user.uid,
      email,
      username: username.toLowerCase().trim(),
      fullName,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', res.user.uid), userProfileData);
    setUserProfile(userProfileData);
    return res.user;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const userDocRef = doc(db, 'users', res.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      const defaultProfile = {
        uid: res.user.uid,
        email: res.user.email,
        username: res.user.email ? res.user.email.split('@')[0] : 'user',
        fullName: res.user.displayName || 'NoteStack User',
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, defaultProfile);
      setUserProfile(defaultProfile);
    } else {
      setUserProfile(userDoc.data());
    }
    return res.user;
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const updateUserProfileData = async (updates) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const deleteAccount = async () => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    // Delete profile doc
    await deleteDoc(doc(db, 'users', uid));
    // Delete Firebase Auth user
    await deleteUser(currentUser);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        googleLogin,
        logout,
        resetPassword,
        updateUserProfileData,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};