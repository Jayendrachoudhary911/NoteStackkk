/**
 * Compresses an image file and converts it into a Base64 string suitable for Firestore storage.
 * 
 * @param {File|Blob} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 1200)
 * @param {number} maxHeight - Maximum height in pixels (default: 800)
 * @param {number} quality - JPEG compression quality 0-1 (default: 0.8)
 * @returns {Promise<string>} Base64 Data URL string
 */
export const compressImageToBase64 = (file, maxWidth = 1200, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Check if valid image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG Data URL
        const base64String = canvas.toDataURL('image/jpeg', quality);
        resolve(base64String);
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load image for compression: ' + err));
      };
    };

    reader.onerror = (err) => {
      reject(new Error('Failed to read file: ' + err));
    };
  });
};

export default compressImageToBase64;
