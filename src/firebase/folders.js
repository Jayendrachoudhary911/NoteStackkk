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
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';

const FOLDERS_COLLECTION = 'folders';

export const createFolder = async (userId, data) => {
  if (!userId) throw new Error('User ID required');
  const payload = {
    userId,
    name: data.name || 'New Folder',
    icon: data.icon || '📁',
    color: data.color || '#88b7f0',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, FOLDERS_COLLECTION), payload);
  return { id: docRef.id, ...payload };
};

export const updateFolder = async (folderId, updates) => {
  if (!folderId) return;
  const folderRef = doc(db, FOLDERS_COLLECTION, folderId);
  await updateDoc(folderRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteFolder = async (folderId, userId = null) => {
  if (!folderId) return;
  const uid = userId || auth.currentUser?.uid;
  // First unassign notes in this folder belonging to this user
  if (uid) {
    try {
      const notesQ = query(
        collection(db, 'notes'),
        where('userId', '==', uid),
        where('folderId', '==', folderId)
      );
      const snap = await getDocs(notesQ);
      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach((docSnap) => {
          batch.update(docSnap.ref, { folderId: null });
        });
        await batch.commit();
      }
    } catch (err) {
      console.warn('Error unassigning notes from folder:', err);
    }
  }
  // Delete folder document
  const folderRef = doc(db, FOLDERS_COLLECTION, folderId);
  await deleteDoc(folderRef);
};

export const subscribeFolders = (userId, callback, onError) => {
  if (!userId) return () => {};
  const q = query(collection(db, FOLDERS_COLLECTION), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const folders = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(folders);
    },
    (err) => {
      console.error('Error subscribing to folders:', err);
      if (onError) onError(err);
    }
  );
};
