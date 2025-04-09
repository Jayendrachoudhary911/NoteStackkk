// src/components/EditorToolbar.jsx
import React from 'react';
import '../styles/EditorToolbar.css';

const EditorToolbar = ({ exec }) => {
  const run = (cmd, val = null) => document.execCommand(cmd, false, val);

  return (
    <div className="toolbar">
      <button onClick={() => run('bold')}><b>B</b></button>
      <button onClick={() => run('italic')}><i>I</i></button>
      <button onClick={() => run('underline')}><u>U</u></button>
      <button onClick={() => run('insertOrderedList')}>OL</button>
      <button onClick={() => run('insertUnorderedList')}>UL</button>
      <button onClick={() => run('formatBlock', '<h1>')}>H1</button>
      <button onClick={() => run('formatBlock', '<h2>')}>H2</button>
      <button onClick={() => run('formatBlock', '<h3>')}>H3</button>
      <button onClick={() => run('formatBlock', '<blockquote>')}>❝</button>
      <button onClick={() => run('formatBlock', '<pre>')}>{'<>'}</button>
      <button onClick={() => run('justifyLeft')}>⬅</button>
      <button onClick={() => run('justifyCenter')}>⮯</button>
      <button onClick={() => run('justifyRight')}>➡</button>
      <button onClick={() => run('undo')}>↺</button>
      <button onClick={() => run('redo')}>↻</button>
      <input type="color" onChange={(e) => run('foreColor', e.target.value)} />
      <button onClick={() => {
        const url = prompt('Enter image URL:');
        if (url) run('insertImage', url);
      }}>🖼️</button>
      <button onClick={() => {
        const url = prompt('Enter link URL:');
        if (url) run('createLink', url);
      }}>🔗</button>
    </div>
  );
};

export default EditorToolbar;
