import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const TAGS_COLLECTION = 'tags';

export const createTag = async (userId, name) => {
  if (!userId || !name?.trim()) return;
  const cleanName = name.trim().toLowerCase().replace(/^#/, '');
  const payload = {
    userId,
    name: cleanName,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, TAGS_COLLECTION), payload);
  return { id: docRef.id, ...payload };
};

export const deleteTag = async (tagId) => {
  if (!tagId) return;
  await deleteDoc(doc(db, TAGS_COLLECTION, tagId));
};

export const subscribeTags = (userId, callback, onError) => {
  if (!userId) return () => {};
  const q = query(collection(db, TAGS_COLLECTION), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const tags = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(tags);
    },
    (err) => {
      console.error('Error subscribing to tags:', err);
      if (onError) onError(err);
    }
  );
};
