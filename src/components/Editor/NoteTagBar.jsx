import React, { useState, useRef } from 'react';
import { Tag, Plus, X, Check } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useClickOutside } from '../../hooks/useClickOutside';

export default function NoteTagBar({ note, onUpdateTags }) {
  const { tags: allTags, createTag } = useNotes();
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const containerRef = useClickOutside(() => {
    setIsAdding(false);
    setInputValue('');
  }, isAdding);

  const currentTags = Array.isArray(note?.tags) ? note.tags : [];

  const handleStartAdd = () => {
    setIsAdding(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleAddTag = async (tagName) => {
    const clean = tagName.trim().toLowerCase().replace(/^#/, '');
    if (!clean) return;

    if (!currentTags.includes(clean)) {
      const updated = [...currentTags, clean];
      onUpdateTags(updated);

      // Create globally in tags collection if doesn't exist
      const existing = allTags.some((t) => t.name.toLowerCase() === clean);
      if (!existing && createTag) {
        await createTag(clean);
      }
    }

    setInputValue('');
    setIsAdding(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = currentTags.filter((t) => t !== tagToRemove);
    onUpdateTags(updated);
  };

  const availableSuggestions = allTags.filter(
    (t) => !currentTags.includes(t.name.toLowerCase()) &&
           t.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, margin: '8px 0 20px' }}>
      {/* Existing Tags */}
      {currentTags.map((tag) => (
        <span
          key={tag}
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface-container-high)',
            color: 'var(--accent)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>#{tag}</span>
          <button
            onClick={() => handleRemoveTag(tag)}
            style={{
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--muted-foreground)',
              cursor: 'pointer',
            }}
            title="Remove tag"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      {/* Add Tag Button or Input */}
      {isAdding ? (
        <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-container-highest)',
              border: '1px solid var(--accent)',
            }}
          >
            <Tag size={12} style={{ color: 'var(--accent)' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="tag name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(inputValue);
                } else if (e.key === 'Escape') {
                  setIsAdding(false);
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.78rem',
                color: 'var(--foreground)',
                width: 100,
              }}
            />
            <button
              onClick={() => handleAddTag(inputValue)}
              style={{ padding: 2, color: 'var(--accent)' }}
            >
              <Check size={13} />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {availableSuggestions.length > 0 && (
            <div
              className="ns-menu"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                minWidth: 140,
                zIndex: 950,
                maxHeight: 160,
                overflowY: 'auto',
              }}
            >
              {availableSuggestions.map((s) => (
                <div
                  key={s.id || s.name}
                  onClick={() => handleAddTag(s.name)}
                  className="ns-menu-item"
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                >
                  #{s.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleStartAdd}
          className="ns-btn ns-btn-ghost"
          style={{
            fontSize: '0.75rem',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            opacity: 0.8,
          }}
          title="Add tag to note"
        >
          <Plus size={12} />
          <span>Add Tag</span>
        </button>
      )}
    </div>
  );
}
