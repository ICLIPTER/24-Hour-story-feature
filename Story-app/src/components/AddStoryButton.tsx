import React, { useRef } from 'react';
import { Plus } from 'lucide-react';
import { resizeImage, convertPdfToBase64, validateFile } from '../utils/fileUtils';

interface AddStoryButtonProps {
  onAddStory: (fileData: string, fileType: 'image' | 'pdf', fileName?: string) => void;
}

const AddStoryButton: React.FC<AddStoryButtonProps> = ({ onAddStory }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid || !validation.type) {
      alert('Please select a valid image file (JPEG, PNG, WebP) under 10MB or PDF file under 50MB');
      return;
    }

    try {
      let fileData: string;
      
      if (validation.type === 'image') {
        fileData = await resizeImage(file);
        onAddStory(fileData, 'image');
      } else {
        fileData = await convertPdfToBase64(file);
        onAddStory(fileData, 'pdf', file.name);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please try again.');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg"
        onClick={handleClick}
      >
        <Plus className="w-8 h-8 text-white" />
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <span className="text-xs text-gray-600 font-medium">Add Story</span>
    </div>
  );
};

export default AddStoryButton;