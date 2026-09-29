/**
 * NoteStack Comment Highlighter & Symbol Decorator
 * Safely decorates commented text and paragraphs inside BlockNote editor DOM
 */

export function applyCommentHighlights(containerElement, comments = [], onCommentClick) {
  if (!containerElement) return;

  // 1. Clean up existing comment badges and highlights
  try {
    const existingBadges = containerElement.querySelectorAll(
      '.ns-comment-badge, .ns-comment-para-badge'
    );
    existingBadges.forEach((b) => b.remove());

    const existingMarks = containerElement.querySelectorAll('.ns-comment-highlight');
    existingMarks.forEach((m) => {
      const parent = m.parentNode;
      if (parent) {
        while (m.firstChild) {
          parent.insertBefore(m.firstChild, m);
        }
        m.remove();
        parent.normalize();
      }
    });
  } catch (err) {
    console.warn('Error clearing comment highlights:', err);
  }

  if (!Array.isArray(comments) || comments.length === 0) return;

  // 2. Decorate each comment with matching text
  comments.forEach((comment) => {
    if (!comment) return;

    // A. Specific text snippet commented
    if (comment.selectedText && comment.selectedText.trim().length > 0) {
      const searchText = comment.selectedText.trim();
      const walker = document.createTreeWalker(containerElement, NodeFilter.SHOW_TEXT, null);
      let node;
      let matchedNode = null;

      while ((node = walker.nextNode())) {
        if (
          node.parentElement?.closest('.ns-comment-highlight') ||
          node.parentElement?.closest('.ns-comment-badge')
        ) {
          continue;
        }
        if (node.nodeValue && node.nodeValue.includes(searchText)) {
          matchedNode = node;
          break;
        }
      }

      if (matchedNode && matchedNode.parentNode) {
        try {
          const fullText = matchedNode.nodeValue;
          const index = fullText.indexOf(searchText);
          if (index !== -1) {
            const beforeText = fullText.substring(0, index);
            const matchContent = fullText.substring(index, index + searchText.length);
            const afterText = fullText.substring(index + searchText.length);

            const parent = matchedNode.parentNode;
            const spanBefore = document.createTextNode(beforeText);
            const spanAfter = document.createTextNode(afterText);

            const mark = document.createElement('mark');
            mark.className = 'ns-comment-highlight';
            mark.setAttribute('data-comment-id', comment.id || '');
            mark.title = `${comment.authorName || 'Collaborator'}: "${comment.text || ''}"`;
            mark.textContent = matchContent;

            const badge = document.createElement('span');
            badge.className = 'ns-comment-badge';
            badge.setAttribute('contenteditable', 'false');
            badge.setAttribute('role', 'button');
            badge.setAttribute('tabindex', '0');
            badge.title = `Comment by ${comment.authorName || 'User'}: ${comment.text || ''}`;
            badge.innerHTML = '💬';

            const handleClick = (e) => {
              e.stopPropagation();
              e.preventDefault();
              if (onCommentClick) {
                onCommentClick(comment);
              }
            };

            mark.addEventListener('click', handleClick);
            badge.addEventListener('click', handleClick);

            parent.insertBefore(spanBefore, matchedNode);
            parent.insertBefore(mark, matchedNode);
            parent.insertBefore(badge, matchedNode);
            parent.insertBefore(spanAfter, matchedNode);
            parent.removeChild(matchedNode);
          }
        } catch (e) {
          console.warn('Error applying text highlight:', e);
        }
      }
    }
    // B. Block or paragraph level comment without selectedText
    else if (comment.blockId) {
      const blockEl = containerElement.querySelector(`[data-id="${comment.blockId}"]`);
      if (blockEl && !blockEl.querySelector('.ns-comment-para-badge')) {
        try {
          const paraBadge = document.createElement('span');
          paraBadge.className = 'ns-comment-para-badge';
          paraBadge.setAttribute('contenteditable', 'false');
          paraBadge.setAttribute('role', 'button');
          paraBadge.title = `Paragraph comment by ${comment.authorName || 'User'}: ${comment.text || ''}`;
          paraBadge.innerHTML = '💬';

          paraBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (onCommentClick) {
              onCommentClick(comment);
            }
          });

          blockEl.style.position = 'relative';
          blockEl.appendChild(paraBadge);
        } catch (e) {
          console.warn('Error applying paragraph badge:', e);
        }
      }
    }
  });
}
