/**
 * Reads an uploaded file as text and parses it into note format
 */
export const parseImportedFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  const rawText = await file.text();

  if (extension === 'json') {
    try {
      const parsed = JSON.parse(rawText);
      // If it's a NoteStack backup with multiple notes
      if (Array.isArray(parsed.notes)) {
        return {
          type: 'multi',
          notes: parsed.notes.map((n) => ({
            title: n.title || 'Imported Note',
            content: typeof n.content === 'string' ? n.content : JSON.stringify(n.content || n.document || []),
            plainText: n.plainText || '',
            tags: n.tags || [],
            icon: n.icon || '📝',
          })),
        };
      }

      // Single note JSON
      const document = parsed.document || (Array.isArray(parsed) ? parsed : []);
      const title = parsed.title || file.name.replace(/\.[^/.]+$/, '');
      return {
        type: 'single',
        note: {
          title,
          content: JSON.stringify(document),
          plainText: parsed.plainText || '',
          tags: parsed.tags || ['imported'],
          icon: parsed.icon || '📝',
        },
      };
    } catch (e) {
      throw new Error('Invalid JSON file format');
    }
  }

  if (extension === 'md' || extension === 'markdown') {
    const lines = rawText.split('\n');
    let title = file.name.replace(/\.[^/.]+$/, '');
    
    // Check if first line is a title (# Title)
    if (lines[0] && lines[0].startsWith('# ')) {
      title = lines[0].replace(/^#\s+/, '').trim();
    }

    const blocks = lines.map((line) => ({
      id: crypto.randomUUID ? crypto.randomUUID() : 'b-' + Math.random().toString(36).substr(2, 9),
      type: line.startsWith('# ') ? 'heading' : (line.startsWith('## ') ? 'heading' : 'paragraph'),
      props: line.startsWith('## ') ? { level: 2 } : { level: 1 },
      content: line.replace(/^#{1,6}\s+/, '').trim() ? [{ type: 'text', text: line.replace(/^#{1,6}\s+/, ''), styles: {} }] : [],
      children: [],
    }));

    return {
      type: 'single',
      note: {
        title,
        content: JSON.stringify(blocks),
        plainText: rawText,
        tags: ['imported'],
        icon: '📝',
      },
    };
  }

  // HTML or Plain Text fallback
  const fallbackTitle = file.name.replace(/\.[^/.]+$/, '');
  const cleanPlainText = rawText.replace(/<[^>]*>?/gm, '').trim();
  const blocks = cleanPlainText.split('\n').filter(Boolean).map((line) => ({
    id: crypto.randomUUID ? crypto.randomUUID() : 'b-' + Math.random().toString(36).substr(2, 9),
    type: 'paragraph',
    props: {},
    content: [{ type: 'text', text: line, styles: {} }],
    children: [],
  }));

  return {
    type: 'single',
    note: {
      title: fallbackTitle,
      content: JSON.stringify(blocks.length ? blocks : []),
      plainText: cleanPlainText,
      tags: ['imported'],
      icon: '📝',
    },
  };
};
