import React, { useRef, useState } from 'react';
import { Database, Download, Upload } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useToast } from '../../context/ToastContext';
import { exportAllNotesBackup } from '../../utils/exportNote';
import { parseImportedFile } from '../../utils/importNote';

export default function DataSettings() {
  const { notes, folders, createNote } = useNotes();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportBackup = () => {
    try {
      exportAllNotesBackup(notes, folders);
      showToast('Full workspace backup downloaded', 'success');
    } catch (e) {
      showToast('Backup export failed', 'error');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const parsed = await parseImportedFile(file);

      if (parsed.type === 'multi') {
        for (const noteData of parsed.notes) {
          await createNote(noteData);
        }
        showToast(`Imported ${parsed.notes.length} notes successfully`, 'success');
      } else if (parsed.type === 'single') {
        await createNote(parsed.note);
        showToast(`Imported "${parsed.note.title}" successfully`, 'success');
      }
    } catch (err) {
      console.error('Import error:', err);
      showToast('Failed to import file: ' + err.message, 'error');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="ns-card" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Database size={20} style={{ color: 'var(--accent)' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Data & Backups</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Export Full Workspace Backup */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Download Complete Backup</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
              Export all {notes.length} notes and {folders.length} folders as a single JSON backup file
            </div>
          </div>
          <button
            onClick={handleExportBackup}
            className="ns-btn ns-btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Download size={15} />
            <span>Export JSON</span>
          </button>
        </div>

        <div style={{ height: 1, background: 'var(--border-subtle)' }} />

        {/* Import Notes */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Import Notes & Backups</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--muted-foreground)' }}>
              Import previously exported NoteStack JSON backups, Markdown files (.md), or HTML notes
            </div>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.md,.markdown,.html,.txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="ns-btn ns-btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Upload size={15} />
              <span>{isImporting ? 'Importing...' : 'Import File'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
