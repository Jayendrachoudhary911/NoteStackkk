// src/services/noteService.js
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

// Create a new note
export const createNote = async (userId) => {
  const noteRef = await addDoc(collection(db, 'notes'), {
    title: 'Untitled Note',
    content: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    userId,
  });
  return noteRef.id;
};

// Get all notes for a specific user
export const getUserNotes = async (userId) => {
  const q = query(collection(db, 'notes'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get a single note by ID
export const getNoteById = async (id) => {
  const noteRef = doc(db, 'notes', id);
  const snapshot = await getDoc(noteRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// Update content/title of a note
export const updateNoteContent = async (id, data) => {
  const noteRef = doc(db, 'notes', id);
  await updateDoc(noteRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// ✅ Add this for better clarity and matching the component name
export const updateNoteById = async (id, data) => {
  return updateNoteContent(id, data); // Reuse the logic internally
};

// Save note: creates if no ID, updates if ID provided
export const saveNote = async ({ id = null, title, content, userId = null }) => {
  if (id) {
    await updateNoteContent(id, { title, content });
  } else {
    await addDoc(collection(db, 'notes'), {
      title,
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      userId,
    });
  }
};

// Delete note
export const deleteNote = async (id) => {
  await deleteDoc(doc(db, 'notes', id));
};
