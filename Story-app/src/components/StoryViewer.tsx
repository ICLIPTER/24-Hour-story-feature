import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { Story } from '../types/story';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onStoryViewed: (storyId: string) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onStoryViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds per story

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Auto-progress through stories (only for images)
  useEffect(() => {
    if (!isOpen || !currentStory || currentStory.fileType === 'pdf') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / STORY_DURATION) * 100;
        if (newProgress >= 100) {
          goToNext();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isOpen]);

  // Mark story as viewed when it starts
  useEffect(() => {
    if (currentStory && !currentStory.viewed) {
      onStoryViewed(currentStory.id);
    }
  }, [currentStory, onStoryViewed]);

  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Download PDF function
  const handleDownloadPdf = () => {
    if (currentStory?.fileType === 'pdf' && currentStory.pdfData) {
      const link = document.createElement('a');
      link.href = currentStory.pdfData;
      link.download = currentStory.fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, goToNext, goToPrevious, onClose]);

  if (!isOpen || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
        {stories.map((story, index) => (
          <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentIndex ? '100%' : 
                       index === currentIndex && story.fileType === 'image' ? `${progress}%` : 
                       index === currentIndex && story.fileType === 'pdf' ? '100%' : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation areas */}
      <div className="absolute inset-0 flex">
        {/* Left tap area */}
        <div 
          className="flex-1 cursor-pointer flex items-center justify-start pl-4"
          onClick={goToPrevious}
        >
          {currentIndex > 0 && (
            <ChevronLeft className="w-8 h-8 text-white/70 hover:text-white transition-colors" />
          )}
        </div>

        {/* Right tap area */}
        <div 
          className="flex-1 cursor-pointer flex items-center justify-end pr-4"
          onClick={goToNext}
        >
          <ChevronRight className="w-8 h-8 text-white/70 hover:text-white transition-colors" />
        </div>
      </div>

      {/* Story content */}
      <div
        className="max-w-md max-h-full mx-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentStory.fileType === 'image' && currentStory.imageData ? (
          <img
            src={currentStory.imageData}
            alt="Story"
            className="w-full h-full object-contain rounded-lg"
            draggable={false}
          />
        ) : currentStory.fileType === 'pdf' ? (
          <div className="bg-white rounded-lg p-8 text-center max-w-sm">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-tr from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Document</h3>
            <p className="text-gray-600 mb-6">{currentStory.fileName}</p>
            <button
              onClick={handleDownloadPdf}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <Download className="w-5 h-5" />
              <span>Download PDF</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Story info */}
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <div className="bg-black/50 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-sm opacity-90">
            Story {currentIndex + 1} of {stories.length}
          </p>
          <p className="text-xs opacity-70 mt-1">
            {new Date(currentStory.timestamp).toLocaleTimeString()}
          </p>
          {currentStory.fileType === 'pdf' && (
            <p className="text-xs opacity-70 mt-1">
              PDF • Tap download to save
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;