export interface Story {
  id: string;
  imageData?: string; // base64 string for images
  pdfData?: string; // base64 string for PDFs
  fileName?: string; // original file name for PDFs
  fileType: 'image' | 'pdf';
  timestamp: number;
  viewed: boolean;
  expired?: boolean;
}

export interface StoryUpload {
  file: File;
  preview: string;
}