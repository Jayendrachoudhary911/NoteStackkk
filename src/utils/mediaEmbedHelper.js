/**
 * Helper to detect and transform URLs into embeddable URLs for YouTube, Google Drive, Vimeo, audio, video, etc.
 */

export const parseMediaLink = (url) => {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // 1. YouTube
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      platform: 'YouTube',
      originalUrl: cleanUrl,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
      defaultTitle: 'YouTube Video',
      icon: '🎥',
    };
  }

  // 2. Google Drive
  const gDriveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([\w-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    const fileId = gDriveMatch[1];
    return {
      type: 'drive',
      platform: 'Google Drive',
      originalUrl: cleanUrl,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      defaultTitle: 'Google Drive Document',
      icon: '📁',
    };
  }

  // 3. Vimeo
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      platform: 'Vimeo',
      originalUrl: cleanUrl,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      defaultTitle: 'Vimeo Video',
      icon: '📹',
    };
  }

  // 4. Spotify
  if (cleanUrl.includes('open.spotify.com')) {
    const spotifyEmbed = cleanUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
    return {
      type: 'spotify',
      platform: 'Spotify',
      originalUrl: cleanUrl,
      embedUrl: spotifyEmbed,
      defaultTitle: 'Spotify Audio',
      icon: '🎵',
    };
  }

  // 5. Direct Video Files (.mp4, .webm, .ogg, .mov, .m4v, .mkv, .avi, data:video, blob:)
  if (
    cleanUrl.startsWith('data:video/') ||
    cleanUrl.startsWith('blob:') ||
    /\.(mp4|webm|ogg|mov|m4v|mkv|avi)(\?.*)?$/i.test(cleanUrl)
  ) {
    let filename = 'Video File';
    if (!cleanUrl.startsWith('data:') && !cleanUrl.startsWith('blob:')) {
      filename = cleanUrl.split('/').pop().split('?')[0] || 'Video File';
    }
    return {
      type: 'video',
      platform: 'Direct Video',
      originalUrl: cleanUrl,
      embedUrl: cleanUrl,
      defaultTitle: decodeURIComponent(filename),
      icon: '🎬',
    };
  }

  // 6. Direct Audio Files (.mp3, .wav, .m4a, .aac, data:audio)
  if (
    cleanUrl.startsWith('data:audio/') ||
    /\.(mp3|wav|m4a|aac)(\?.*)?$/i.test(cleanUrl)
  ) {
    let filename = 'Audio File';
    if (!cleanUrl.startsWith('data:')) {
      filename = cleanUrl.split('/').pop().split('?')[0] || 'Audio File';
    }
    return {
      type: 'audio',
      platform: 'Direct Audio',
      originalUrl: cleanUrl,
      embedUrl: cleanUrl,
      defaultTitle: decodeURIComponent(filename),
      icon: '🎧',
    };
  }

  // 7. Generic Cloud File / Link (Dropbox, GitHub, Figma, etc.)
  let platform = 'Web Resource';
  let icon = '📎';
  if (cleanUrl.includes('dropbox.com')) {
    platform = 'Dropbox';
    icon = '📦';
  } else if (cleanUrl.includes('figma.com')) {
    platform = 'Figma';
    icon = '🎨';
  } else if (cleanUrl.includes('github.com')) {
    platform = 'GitHub';
    icon = '🐙';
  } else if (cleanUrl.includes('onedrive.live.com')) {
    platform = 'OneDrive';
    icon = '☁️';
  }

  return {
    type: 'file',
    platform,
    originalUrl: cleanUrl,
    embedUrl: cleanUrl,
    defaultTitle: cleanUrl.replace(/^https?:\/\//, '').split('/')[0] + ' Attachment',
    icon,
  };
};

/**
 * Creates media item from a local file object (supports videos, audio, images, documents)
 * Stored directly as base64 string in Firestore for live collaboration across sessions
 */
export const readFileAsMediaItem = (file) => {
  return new Promise((resolve, reject) => {
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v|mkv|avi)$/i.test(file.name);
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg)$/i.test(file.name);
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);

    // Limit direct Firestore string embeds to 750KB to respect Firestore's 1MB document limit
    const MAX_FIRESTORE_FILE_SIZE = 750 * 1024;

    if (!isImage && file.size > MAX_FIRESTORE_FILE_SIZE) {
      return reject(
        new Error(
          `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds Firestore's 750KB document limit. For larger videos, please paste a YouTube, Google Drive, or cloud video link in the "Embed Link" tab.`
        )
      );
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      resolve({
        type: isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'image' : 'file',
        platform: isVideo ? 'Native Video' : isAudio ? 'Native Audio' : isImage ? 'Image' : 'File Attachment',
        url: dataUrl,
        originalUrl: dataUrl,
        embedUrl: dataUrl,
        defaultTitle: file.name,
        icon: isVideo ? '🎬' : isAudio ? '🎧' : isImage ? '🖼️' : '📎',
        mimeType: file.type || (isVideo ? 'video/mp4' : undefined),
        size: file.size,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
