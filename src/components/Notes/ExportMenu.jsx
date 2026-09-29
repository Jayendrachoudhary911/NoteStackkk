import React from 'react';
import {
  Download,
  FileCode,
  FileText,
  Printer,
  X,
  Code
} from 'lucide-react';
import {
  exportNoteAsMarkdown,
  exportNoteAsHTML,
  exportNoteAsJSON,
  printNote
} from '../../utils/exportNote';
import { useToast } from '../../context/ToastContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';

export default function ExportMenu({ open, onClose, note, editorInstance }) {
  const { showToast } = useToast();

  useEscapeKey(onClose, open);

  if (!open || !note) return null;

  const handleExportMarkdown = async () => {
    try {
      await exportNoteAsMarkdown(note, editorInstance);
      showToast('Exported as Markdown', 'success');
      onClose();
    } catch (e) {
      showToast('Export failed', 'error');
    }
  };

  const handleExportHTML = async () => {
    try {
      await exportNoteAsHTML(note, editorInstance);
      showToast('Exported as HTML', 'success');
      onClose();
    } catch (e) {
      showToast('Export failed', 'error');
    }
  };

  const handleExportJSON = () => {
    try {
      exportNoteAsJSON(note, editorInstance);
      showToast('Exported as JSON', 'success');
      onClose();
    } catch (e) {
      showToast('Export failed', 'error');
    }
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      printNote();
    }, 150);
  };

  return (
    <div className="ns-modal-overlay" onClick={onClose}>
      <div
        className="ns-dialog"
        style={{ maxWidth: 360, padding: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Export Note</h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--muted-foreground)', padding: 4, borderRadius: 6 }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={handleExportMarkdown}
            className="ns-menu-item"
            style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <FileText size={18} style={{ color: 'var(--accent)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>Markdown (.md)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                Plain text with formatting tags
              </div>
            </div>
          </button>

          <button
            onClick={handleExportHTML}
            className="ns-menu-item"
            style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <FileCode size={18} style={{ color: '#8cefcb' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>HTML (.html)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                Standalone web page with typography
              </div>
            </div>
          </button>

          <button
            onClick={handleExportJSON}
            className="ns-menu-item"
            style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <Code size={18} style={{ color: '#f5d397' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>BlockNote JSON (.json)</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                Native document structure backup
              </div>
            </div>
          </button>

          <div
            style={{
              height: 1,
              background: 'var(--border-subtle)',
              margin: '6px 0',
            }}
          />

          <button
            onClick={handlePrint}
            className="ns-menu-item"
            style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)' }}
          >
            <Printer size={18} style={{ color: 'var(--muted-foreground)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>Print / Save as PDF</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)' }}>
                Formatted clean print layout
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
