import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Stack } from '@mui/material';
import { Folder, Label, Delete, Add } from '@mui/icons-material';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../context/AuthContext';

export default function FolderManager() {
  const { currentUser } = useAuth();
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const qFolders = query(collection(db, 'folders'), where('userId', '==', currentUser.uid));
    const unsubFolders = onSnapshot(qFolders, (snapshot) => {
      setFolders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qTags = query(collection(db, 'tags'), where('userId', '==', currentUser.uid));
    const unsubTags = onSnapshot(qTags, (snapshot) => {
      setTags(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubFolders();
      unsubTags();
    };
  }, [currentUser]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await addDoc(collection(db, 'folders'), { name: newFolderName, userId: currentUser.uid, createdAt: serverTimestamp() });
    setNewFolderName('');
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    await addDoc(collection(db, 'tags'), { name: newTagName, userId: currentUser.uid, createdAt: serverTimestamp() });
    setNewTagName('');
  };

  const handleDelete = async (id, type) => {
    await deleteDoc(doc(db, type, id));
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Folder color="primary" /> Manage Folders
        </Typography>
        <Box component="form" onSubmit={handleCreateFolder} sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField size="small" placeholder="New Folder Name" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" startIcon={<Add />}>Add</Button>
        </Box>
        <List>
          {folders.map(folder => (
            <ListItem key={folder.id} divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <ListItemText primary={folder.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleDelete(folder.id, 'folders')}><Delete fontSize="small" /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Label color="primary" /> Manage Tags
        </Typography>
        <Box component="form" onSubmit={handleCreateTag} sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField size="small" placeholder="New Tag Name" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" startIcon={<Add />}>Add</Button>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {tags.map(tag => (
            <Chip key={tag.id} label={tag.name} onDelete={() => handleDelete(tag.id, 'tags')} color="primary" variant="outlined" sx={{ mb: 1, border: 'none' }} />
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}