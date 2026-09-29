import { saveAs } from 'file-saver';

/**
 * Sanitizes a title string to be a safe filesystem filename
 */
export const sanitizeFilename = (title, extension = '') => {
  const safe = (title || 'untitled-note')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_ ]/gi, '')
    .replace(/\s+/g, '-')
    .substring(0, 60);

  const cleanExt = extension ? (extension.startsWith('.') ? extension : `.${extension}`) : '';
  return `${safe || 'note'}${cleanExt}`;
};

/**
 * Exports note as Markdown (.md)
 */
export const exportNoteAsMarkdown = async (note, editorInstance) => {
  let markdown = '';

  if (editorInstance && editorInstance.blocksToMarkdownLossy) {
    try {
      markdown = await editorInstance.blocksToMarkdownLossy(editorInstance.document);
    } catch (e) {
      console.warn('BlockNote blocksToMarkdownLossy failed, falling back:', e);
    }
  }

  if (!markdown) {
    // Fallback: extract from plainText or raw blocks
    markdown = `# ${note.title || 'Untitled Note'}\n\n${note.plainText || ''}`;
  } else {
    // Prepend title if not already present
    if (!markdown.startsWith('# ')) {
      markdown = `# ${note.title || 'Untitled Note'}\n\n${markdown}`;
    }
  }

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, sanitizeFilename(note.title, '.md'));
};

/**
 * Exports note as standalone styled HTML (.html)
 */
export const exportNoteAsHTML = async (note, editorInstance) => {
  let bodyHTML = '';

  if (editorInstance && editorInstance.blocksToHTMLLossy) {
    try {
      bodyHTML = await editorInstance.blocksToHTMLLossy(editorInstance.document);
    } catch (e) {
      console.warn('BlockNote blocksToHTMLLossy failed, using fallback:', e);
    }
  }

  if (!bodyHTML) {
    bodyHTML = `<p>${(note.plainText || '').replace(/\n/g, '<br/>')}</p>`;
  }

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHTML(note.title || 'Untitled Note')}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      line-height: 1.6;
      max-width: 760px;
      margin: 40px auto;
      padding: 0 20px;
      color: #1a1a1a;
      background-color: #fafafa;
    }
    .note-container {
      background: #ffffff;
      padding: 48px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    h1.title {
      font-size: 2.4rem;
      font-weight: 800;
      margin-bottom: 8px;
      color: #111827;
    }
    .meta {
      font-size: 0.85rem;
      color: #6b7280;
      margin-bottom: 32px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 16px;
    }
    pre {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
    }
    code {
      font-family: monospace;
      font-size: 0.9em;
    }
    blockquote {
      border-left: 4px solid #3b82f6;
      margin: 0;
      padding-left: 16px;
      color: #4b5563;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px 12px;
    }
  </style>
</head>
<body>
  <div class="note-container">
    <h1 class="title">${escapeHTML(note.title || 'Untitled Note')}</h1>
    <div class="meta">Exported from NoteStack • ${new Date().toLocaleDateString()}</div>
    <div class="content">
      ${bodyHTML}
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  saveAs(blob, sanitizeFilename(note.title, '.html'));
};

/**
 * Exports note as raw BlockNote JSON (.json)
 */
export const exportNoteAsJSON = (note, editorInstance) => {
  let documentBlocks;

  if (editorInstance && editorInstance.document) {
    documentBlocks = editorInstance.document;
  } else {
    try {
      documentBlocks = typeof note.content === 'string' ? JSON.parse(note.content) : note.content;
    } catch {
      documentBlocks = [];
    }
  }

  const exportPayload = {
    noteStackVersion: '1.0',
    exportedAt: new Date().toISOString(),
    title: note.title || 'Untitled Note',
    icon: note.icon || '📝',
    tags: note.tags || [],
    document: documentBlocks,
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  saveAs(blob, sanitizeFilename(note.title, '.json'));
};

/**
 * Exports a full JSON backup of all user notes
 */
export const exportAllNotesBackup = (notes = [], folders = []) => {
  const backup = {
    app: 'NoteStack',
    version: '1.0',
    exportDate: new Date().toISOString(),
    notesCount: notes.length,
    foldersCount: folders.length,
    folders: folders.map((f) => ({ id: f.id, name: f.name, color: f.color, icon: f.icon })),
    notes: notes.map((n) => ({
      id: n.id,
      title: n.title,
      icon: n.icon,
      folderId: n.folderId,
      tags: n.tags,
      isFavorite: n.isFavorite,
      isPinned: n.isPinned,
      isArchived: n.isArchived,
      content: n.content,
      plainText: n.plainText,
      createdAt: n.createdAt?.toDate ? n.createdAt.toDate().toISOString() : null,
      updatedAt: n.updatedAt?.toDate ? n.updatedAt.toDate().toISOString() : null,
    })),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `notestack-backup-${new Date().toISOString().slice(0, 10)}.json`);
};

/**
 * Invokes browser print window for printing or Save as PDF
 */
export const printNote = () => {
  window.print();
};

function escapeHTML(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
