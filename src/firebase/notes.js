import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';

const NOTES_COLLECTION = 'notes';

/**
 * Creates a new note in Firestore
 */
export const createNote = async (userId, initialData = {}) => {
  if (!userId) throw new Error('User ID required to create note');
  
  const defaultNote = {
    userId,
    title: initialData.title || 'Untitled',
    content: initialData.content || JSON.stringify([
      {
        id: crypto.randomUUID ? crypto.randomUUID() : 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'paragraph',
        props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
        content: [],
        children: []
      }
    ]),
    plainText: initialData.plainText || '',
    folderId: initialData.folderId || null,
    icon: initialData.icon || '📝',
    cover: initialData.cover || null,
    tags: initialData.tags || [],
    mediaLinks: initialData.mediaLinks || [],
    comments: initialData.comments || [],
    teamId: initialData.teamId || null,
    isFavorite: Boolean(initialData.isFavorite),
    isArchived: false,
    isPinned: Boolean(initialData.isPinned),
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastOpenedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, NOTES_COLLECTION), defaultNote);
  return { id: docRef.id, ...defaultNote };
};

/**
 * Updates an existing note document
 */
export const updateNote = async (noteId, updates) => {
  if (!noteId) throw new Error('Note ID required to update note');
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(noteRef, payload);
};

/**
 * Updates lastOpenedAt when a note is viewed
 */
export const touchNoteOpened = async (noteId) => {
  if (!noteId) return;
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  await updateDoc(noteRef, {
    lastOpenedAt: serverTimestamp(),
  });
};

/**
 * Soft deletes a note (moves to trash)
 */
export const softDeleteNote = async (noteId) => {
  return updateNote(noteId, { isDeleted: true });
};

/**
 * Restores a note from trash
 */
export const restoreNote = async (noteId) => {
  return updateNote(noteId, { isDeleted: false });
};

/**
 * Permanently deletes a note
 */
export const permanentlyDeleteNote = async (noteId) => {
  if (!noteId) return;
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  await deleteDoc(noteRef);
};

/**
 * Empties trash for user
 */
export const emptyTrash = async (notesInTrash) => {
  if (!notesInTrash || notesInTrash.length === 0) return;
  const batch = writeBatch(db);
  notesInTrash.forEach((note) => {
    const noteRef = doc(db, NOTES_COLLECTION, note.id);
    batch.delete(noteRef);
  });
  await batch.commit();
};

/**
 * Toggles favorite state
 */
export const toggleFavorite = async (noteId, currentStatus) => {
  return updateNote(noteId, { isFavorite: !currentStatus });
};

/**
 * Toggles pinned state
 */
export const togglePinned = async (noteId, currentStatus) => {
  return updateNote(noteId, { isPinned: !currentStatus });
};

/**
 * Toggles archived state
 */
export const archiveNote = async (noteId, currentStatus) => {
  return updateNote(noteId, { isArchived: !currentStatus });
};

/**
 * Moves note to a folder (or unassigns if folderId is null)
 */
export const moveNote = async (noteId, folderId) => {
  return updateNote(noteId, { folderId: folderId || null });
};

/**
 * Duplicates a note
 */
export const duplicateNote = async (originalNote, userId) => {
  if (!originalNote) throw new Error('Original note required to duplicate');
  const copyTitle = `${originalNote.title || 'Untitled'} — Copy`;
  
  return createNote(userId, {
    title: copyTitle,
    content: originalNote.content || '',
    plainText: originalNote.plainText || '',
    folderId: originalNote.folderId || null,
    icon: originalNote.icon || '📝',
    cover: originalNote.cover || null,
    tags: Array.isArray(originalNote.tags) ? [...originalNote.tags] : [],
    isFavorite: false,
    isPinned: false,
  });
};

/**
 * Subscribes to all notes belonging to the user
 */
export const subscribeNotes = (userId, callback, onError) => {
  if (!userId) return () => {};
  const q = query(collection(db, NOTES_COLLECTION), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(notes);
    },
    (err) => {
      console.error('Error subscribing to notes:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Subscribes to notes belonging to a team
 */
export const subscribeTeamNotes = (teamId, callback, onError) => {
  if (!teamId) return () => {};
  const q = query(collection(db, NOTES_COLLECTION), where('teamId', '==', teamId));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(notes);
    },
    (err) => {
      console.error('Error subscribing to team notes:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Adds a comment to a note (supports section/selection anchoring)
 */
export const addNoteComment = async (noteId, commentData) => {
  if (!noteId || !commentData?.text?.trim()) return;
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  const newComment = {
    id: 'c-' + Math.random().toString(36).substr(2, 9),
    userId: commentData.userId || 'anon',
    authorName: commentData.authorName || 'Anonymous',
    authorPhoto: commentData.authorPhoto || null,
    text: commentData.text.trim(),
    blockId: commentData.blockId || null,
    selectedText: commentData.selectedText || null,
    createdAt: new Date().toISOString(),
    resolved: false,
  };

  await updateDoc(noteRef, {
    comments: arrayUnion(newComment),
    updatedAt: serverTimestamp(),
  });
  return newComment;
};

/**
 * Toggles resolved status of a comment on a note
 */
export const toggleResolveNoteComment = async (noteId, commentId, currentComments = []) => {
  if (!noteId || !commentId) return;
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  const updatedComments = currentComments.map((c) => {
    if (c.id === commentId) {
      return { ...c, resolved: !c.resolved };
    }
    return c;
  });
  await updateDoc(noteRef, {
    comments: updatedComments,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Deletes a comment from a note
 */
export const deleteNoteComment = async (noteId, commentId, currentComments = []) => {
  if (!noteId || !commentId) return;
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  const updatedComments = currentComments.filter((c) => c.id !== commentId);
  await updateDoc(noteRef, {
    comments: updatedComments,
    updatedAt: serverTimestamp(),
  });
};

