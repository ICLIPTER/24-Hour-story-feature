import React from 'react';
import { FileText } from 'lucide-react';
import { Story } from '../types/story';

interface StoryThumbnailProps {
  story: Story;
  onClick: () => void;
  timeRemaining?: number;
  showTimeRemaining?: boolean;
}

const StoryThumbnail: React.FC<StoryThumbnailProps> = ({ 
  story, 
  onClick, 
  timeRemaining, 
  showTimeRemaining = true 
}) => {
  const renderThumbnail = () => {
    if (story.fileType === 'image' && story.imageData) {
      return (
        <img
          src={story.imageData}
          alt="Story"
          className="w-full h-full object-cover rounded-full"
        />
      );
    } else if (story.fileType === 'pdf') {
      return (
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-red-500 to-red-600 flex items-center justify-center">
          <FileText className="w-8 h-8 text-white" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`relative w-16 h-16 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${
          !story.viewed && !story.expired
            ? 'bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5'
            : 'bg-gray-300 p-0.5'
        }`}
        onClick={onClick}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
          {renderThumbnail()}
        </div>
        
        {/* Time remaining indicator */}
        {showTimeRemaining && timeRemaining !== undefined && !story.expired && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1 py-0.5 text-xs font-medium text-gray-600 shadow-md">
            {timeRemaining}h
          </div>
        )}
      </div>
      
      {/* File name for PDFs */}
      {story.fileType === 'pdf' && story.fileName && (
        <span className="text-xs text-gray-600 text-center max-w-16 truncate">
          {story.fileName.replace('.pdf', '')}
        </span>
      )}
    </div>
  );
};

export default StoryThumbnail;