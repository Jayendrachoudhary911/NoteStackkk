import {
  collection,
  doc,
  setDoc,
  query,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const PRESENCE_COLLECTION = 'presence';

/**
 * Updates current user heartbeat presence in Firestore
 */
export const touchPresence = async (user, currentNoteId = null) => {
  if (!user?.uid) return;

  const userRef = doc(db, PRESENCE_COLLECTION, user.uid);
  try {
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User',
        currentNoteId: currentNoteId || null,
        lastActive: serverTimestamp(),
        online: true,
      },
      { merge: true }
    );
  } catch (err) {
    // Non-fatal presence update error
    console.warn('Presence update error:', err);
  }
};

/**
 * Subscribes to real-time active users in Firestore
 */
export const subscribeActiveUsers = (callback) => {
  const q = query(collection(db, PRESENCE_COLLECTION));

  return onSnapshot(
    q,
    (snapshot) => {
      const now = Date.now();
      const activeUsers = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((u) => {
          // Consider active if updated within last 10 minutes or online
          if (!u.lastActive) return true;
          const time = u.lastActive.toMillis ? u.lastActive.toMillis() : new Date(u.lastActive).getTime();
          return now - time < 10 * 60 * 1000;
        });

      callback(activeUsers);
    },
    (err) => {
      console.warn('Error subscribing to active users:', err);
      callback([]);
    }
  );
};
