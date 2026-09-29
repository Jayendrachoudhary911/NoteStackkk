import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const SHARES_COLLECTION = 'shares';

/**
 * Retrieves public share record by share ID
 */
export const getPublicShare = async (shareId) => {
  if (!shareId) return null;
  try {
    const shareRef = doc(db, SHARES_COLLECTION, shareId);
    const snap = await getDoc(shareRef);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (!data.isPublic) return null;
    return { id: snap.id, ...data };
  } catch (err) {
    console.error('Error fetching public share:', err);
    return null;
  }
};

/**
 * Checks existing share configuration for a note
 */
export const getShareForNote = async (noteId) => {
  if (!noteId) return null;
  // In NoteStack, the share document ID is identical to the noteId
  try {
    const shareRef = doc(db, SHARES_COLLECTION, noteId);
    const snap = await getDoc(shareRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn('Direct share lookup error, trying query fallback:', err);
  }

  // Fallback query if stored under different key
  try {
    const q = query(collection(db, SHARES_COLLECTION), where('noteId', '==', noteId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (err) {
    console.warn('Fallback share query error:', err);
  }
  return null;
};

/**
 * Enables public sharing for a note with configurable permissions
 */
export const enablePublicShare = async (note, authorName = 'Anonymous', options = {}) => {
  if (!note?.id) throw new Error('Note ID required to share');
  
  const shareId = note.id;
  const shareRef = doc(db, SHARES_COLLECTION, shareId);
  
  const payload = {
    noteId: note.id,
    userId: note.userId,
    authorName,
    title: note.title || 'Untitled Note',
    content: note.content || '[]',
    plainText: note.plainText || '',
    icon: note.icon || '📝',
    cover: note.cover || null,
    tags: note.tags || [],
    mediaLinks: note.mediaLinks || [],
    isPublic: true,
    allowComments: options.allowComments ?? true,
    accessLevel: options.accessLevel || 'view',
    sharedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(shareRef, payload, { merge: true });
  return { id: shareId, ...payload };
};

/**
 * Updates sharing options (e.g. comments allowed, access level)
 */
export const updateShareOptions = async (noteId, options) => {
  if (!noteId) return;
  const shareRef = doc(db, SHARES_COLLECTION, noteId);
  await setDoc(shareRef, {
    ...options,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

/**
 * Updates shared note content (when editing is enabled by owner or admin)
 */
export const updatePublicShareContent = async (shareId, updates) => {
  if (!shareId) return;
  const shareRef = doc(db, SHARES_COLLECTION, shareId);
  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  await setDoc(shareRef, payload, { merge: true });

  // Also attempt updating the base notes document so owner sees edits immediately
  try {
    const noteRef = doc(db, 'notes', shareId);
    await setDoc(noteRef, payload, { merge: true });
  } catch (err) {
    // Non-fatal if client only has permissions for the public share document
    console.debug('Base note sync skipped or unauthorized:', err);
  }
};

/**
 * Adds a comment to a shared note
 */
export const addShareComment = async (shareId, commentData) => {
  if (!shareId || !commentData?.text?.trim()) return;
  const shareRef = doc(db, SHARES_COLLECTION, shareId);
  const snap = await getDoc(shareRef);
  const currentComments = snap.exists() ? (snap.data().comments || []) : [];

  const newComment = {
    id: 'c-' + Math.random().toString(36).substr(2, 9),
    userId: commentData.userId || 'anon',
    authorName: commentData.authorName || 'Guest User',
    authorPhoto: commentData.authorPhoto || null,
    text: commentData.text.trim(),
    blockId: commentData.blockId || null,
    selectedText: commentData.selectedText || null,
    createdAt: new Date().toISOString(),
    resolved: false,
  };

  const updatedComments = [...currentComments, newComment];
  await setDoc(shareRef, {
    comments: updatedComments,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  // Also sync to base note comments if possible
  try {
    const noteRef = doc(db, 'notes', shareId);
    await setDoc(noteRef, { comments: updatedComments }, { merge: true });
  } catch (e) {
    // Non-fatal
  }

  return newComment;
};

/**
 * Deletes or resolves a comment on a shared note
 */
export const deleteShareComment = async (shareId, commentId, currentComments = []) => {
  if (!shareId || !commentId) return;
  const shareRef = doc(db, SHARES_COLLECTION, shareId);
  const updatedComments = currentComments.filter((c) => c.id !== commentId);
  await setDoc(shareRef, {
    comments: updatedComments,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  try {
    const noteRef = doc(db, 'notes', shareId);
    await setDoc(noteRef, { comments: updatedComments }, { merge: true });
  } catch (e) {}
};

/**
 * Disables public sharing for a note
 */
export const disablePublicShare = async (shareId) => {
  if (!shareId) return;
  const shareRef = doc(db, SHARES_COLLECTION, shareId);
  try {
    await deleteDoc(shareRef);
  } catch (err) {
    // Fallback to setting isPublic: false
    await setDoc(shareRef, { isPublic: false, updatedAt: serverTimestamp() }, { merge: true });
  }
};
