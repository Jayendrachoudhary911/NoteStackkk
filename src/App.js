import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import SharedNote from './pages/SharedNote';
import NoteReader from './pages/NoteReader';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/shared/:id" element={<SharedNote />} />
        <Route path="/note/:id" element={<NoteReader />} />
      </Routes>
    </Router>
  );
}

export default App;
