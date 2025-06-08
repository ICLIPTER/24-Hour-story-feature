export const resizeImage = (file: File, maxWidth: number = 1080, maxHeight: number = 1920): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = Math.min(width, maxWidth);
          height = width / aspectRatio;
        } else {
          height = Math.min(height, maxHeight);
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with quality compression
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      resolve(base64);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const convertPdfToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert PDF to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsDataURL(file);
  });
};

export const generatePdfThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create a simple PDF thumbnail placeholder
    canvas.width = 200;
    canvas.height = 280;
    
    if (ctx) {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, 280);
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#dc2626');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 200, 280);
      
      // Add PDF icon
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PDF', 100, 140);
      
      // Add file name (truncated)
      ctx.font = '12px Arial';
      const fileName = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
      ctx.fillText(fileName, 100, 160);
      
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    } else {
      reject(new Error('Failed to create PDF thumbnail'));
    }
  });
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  return validTypes.includes(file.type) && file.size <= maxSize;
};

export const validatePdfFile = (file: File): boolean => {
  const validTypes = ['application/pdf'];
  const maxSize = 50 * 1024 * 1024; // 50MB

  return validTypes.includes(file.type) && file.size <= maxSize;
};

export const validateFile = (file: File): { isValid: boolean; type: 'image' | 'pdf' | null } => {
  if (validateImageFile(file)) {
    return { isValid: true, type: 'image' };
  } else if (validatePdfFile(file)) {
    return { isValid: true, type: 'pdf' };
  }
  return { isValid: false, type: null };
};