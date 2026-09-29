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
  arrayUnion,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

const TEAMS_COLLECTION = 'teams';

/**
 * Creates a new team workspace
 */
export const createTeam = async (userId, userEmail, userName, data = {}) => {
  if (!userId) throw new Error('User ID required to create team');

  const payload = {
    name: data.name?.trim() || 'My Team',
    description: data.description?.trim() || '',
    icon: data.icon || '👥',
    color: data.color || '#3b82f6',
    ownerId: userId,
    memberUids: [userId],
    adminUids: [userId],
    members: [
      {
        uid: userId,
        email: userEmail || 'owner@notestack.app',
        name: userName || 'Team Owner',
        role: 'owner',
        joinedAt: new Date().toISOString(),
      },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, TEAMS_COLLECTION), payload);
  return { id: docRef.id, ...payload };
};

/**
 * Subscribes to all teams where the user is a member
 */
export const subscribeUserTeams = (userId, callback, onError) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, TEAMS_COLLECTION),
    where('memberUids', 'array-contains', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const teams = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(teams);
    },
    (err) => {
      console.error('Error subscribing to teams:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Fetches team data by doc ID
 */
export const getTeam = async (teamId) => {
  if (!teamId) return null;
  const teamRef = doc(db, TEAMS_COLLECTION, teamId);
  const snap = await getDoc(teamRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

/**
 * Finds user profile by username or email for team invites
 */
export const findUserByUsernameOrEmail = async (identifier) => {
  if (!identifier) return null;
  const cleaned = identifier.trim().replace(/^@/, '').toLowerCase();

  try {
    // Try email query
    const emailQuery = query(collection(db, 'users'), where('email', '==', cleaned));
    const emailSnap = await getDocs(emailQuery);
    if (!emailSnap.empty) {
      const d = emailSnap.docs[0];
      return { uid: d.id, ...d.data() };
    }

    // Try username query
    const usernameQuery = query(collection(db, 'users'), where('username', '==', cleaned));
    const usernameSnap = await getDocs(usernameQuery);
    if (!usernameSnap.empty) {
      const d = usernameSnap.docs[0];
      return { uid: d.id, ...d.data() };
    }
  } catch (err) {
    console.warn('Error finding user by username or email:', err);
  }

  return null;
};

/**
 * Adds current user to team via invite link
 */
export const joinTeam = async (teamId, user) => {
  if (!teamId || !user?.uid) throw new Error('Valid team ID and authenticated user required');

  const teamRef = doc(db, TEAMS_COLLECTION, teamId);
  const snap = await getDoc(teamRef);
  if (!snap.exists()) throw new Error('Team workspace not found');

  const existingTeam = snap.data();
  const alreadyMember = (existingTeam.memberUids || []).includes(user.uid);
  if (alreadyMember) {
    return { id: snap.id, ...existingTeam, alreadyMember: true };
  }

  const newMember = {
    uid: user.uid,
    email: (user.email || '').toLowerCase().trim(),
    name: user.displayName || user.email?.split('@')[0] || 'Team Member',
    role: 'member',
    joinedAt: new Date().toISOString(),
  };

  await updateDoc(teamRef, {
    memberUids: arrayUnion(user.uid),
    members: arrayUnion(newMember),
    updatedAt: serverTimestamp(),
  });

  return { id: snap.id, ...existingTeam, joined: true };
};

/**
 * Adds a new member to a team
 */
export const addTeamMember = async (teamId, memberData) => {
  if (!teamId || !memberData?.email) return;

  const teamRef = doc(db, TEAMS_COLLECTION, teamId);
  const snap = await getDoc(teamRef);
  if (!snap.exists()) return;

  const existingTeam = snap.data();
  const alreadyMember = existingTeam.members?.some(
    (m) => m.email.toLowerCase() === memberData.email.toLowerCase()
  );
  if (alreadyMember) throw new Error('User is already a member of this team');

  const memberUid = memberData.uid || 'user-' + Math.random().toString(36).substr(2, 9);
  const role = memberData.role === 'admin' ? 'admin' : 'member';
  const newMember = {
    uid: memberUid,
    email: memberData.email.toLowerCase().trim(),
    name: memberData.name || memberData.email.split('@')[0],
    role,
    joinedAt: new Date().toISOString(),
  };

  const updates = {
    memberUids: arrayUnion(memberUid),
    members: arrayUnion(newMember),
    updatedAt: serverTimestamp(),
  };

  if (role === 'admin') {
    updates.adminUids = arrayUnion(memberUid);
  }

  await updateDoc(teamRef, updates);

  return newMember;
};

/**
 * Updates a member's role within a team ('admin' | 'member')
 */
export const updateTeamMemberRole = async (teamId, memberUid, newRole) => {
  if (!teamId || !memberUid) return;

  const teamRef = doc(db, TEAMS_COLLECTION, teamId);
  const snap = await getDoc(teamRef);
  if (!snap.exists()) return;

  const existingTeam = snap.data();
  const updatedMembers = (existingTeam.members || []).map((m) => {
    if (m.uid === memberUid && m.role !== 'owner') {
      return { ...m, role: newRole };
    }
    return m;
  });

  const currentAdminUids = new Set(existingTeam.adminUids || [existingTeam.ownerId]);
  if (newRole === 'admin') {
    currentAdminUids.add(memberUid);
  } else {
    currentAdminUids.delete(memberUid);
  }
  // Ensure owner is always in adminUids
  if (existingTeam.ownerId) {
    currentAdminUids.add(existingTeam.ownerId);
  }

  await updateDoc(teamRef, {
    members: updatedMembers,
    adminUids: Array.from(currentAdminUids),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Removes a member from a team
 */
export const removeTeamMember = async (teamId, memberUid) => {
  if (!teamId || !memberUid) return;

  const teamRef = doc(db, TEAMS_COLLECTION, teamId);
  const snap = await getDoc(teamRef);
  if (!snap.exists()) return;

  const existingTeam = snap.data();
  const updatedMembers = (existingTeam.members || []).filter((m) => m.uid !== memberUid);
  const updatedMemberUids = (existingTeam.memberUids || []).filter((id) => id !== memberUid);
  const updatedAdminUids = (existingTeam.adminUids || []).filter((id) => id !== memberUid);

  await updateDoc(teamRef, {
    members: updatedMembers,
    memberUids: updatedMemberUids,
    adminUids: updatedAdminUids,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Updates team details
 */
export const updateTeam = async (teamId, updates) => {
  if (!teamId) return;
  const teamRef = doc(db, TEAMS_COLLECTION, teamId);
  await updateDoc(teamRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Deletes a team workspace
 */
export const deleteTeam = async (teamId) => {
  if (!teamId) return;
  const teamRef = doc(db, TEAMS_COLLECTION, teamId);
  await deleteDoc(teamRef);
};
