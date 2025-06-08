import React, { useState } from 'react';
import { ArrowLeft, Trash2, FileText, Download } from 'lucide-react';
import { useStories } from '../hooks/useStories';
import StoryThumbnail from './StoryThumbnail';
import StoryViewer from './StoryViewer';

interface ExpiredStoriesPageProps {
  onBack: () => void;
}

const ExpiredStoriesPage: React.FC<ExpiredStoriesPageProps> = ({ onBack }) => {
  const { expiredStories, deleteExpiredStory, clearAllExpiredStories } = useStories();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const handleStoryClick = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  const handleDeleteStory = (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this story?')) {
      deleteExpiredStory(storyId);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all expired stories?')) {
      clearAllExpiredStories();
    }
  };

  const handleDownloadPdf = (story: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (story.fileType === 'pdf' && story.pdfData) {
      const link = document.createElement('a');
      link.href = story.pdfData;
      link.download = story.fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Expired Stories</h1>
          {expiredStories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {expiredStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Expired Stories</h2>
            <p className="text-gray-600">Stories that expire after 24 hours will appear here</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {expiredStories.length} expired {expiredStories.length === 1 ? 'story' : 'stories'}
              </p>
            </div>

            {/* Grid layout for expired stories */}
            <div className="grid grid-cols-3 gap-4">
              {expiredStories.map((story, index) => (
                <div key={story.id} className="relative group">
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleStoryClick(index)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {story.fileType === 'image' && story.imageData ? (
                        <img
                          src={story.imageData}
                          alt="Expired story"
                          className="w-full h-full object-cover"
                        />
                      ) : story.fileType === 'pdf' ? (
                        <div className="w-full h-full bg-gradient-to-tr from-red-500 to-red-600 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                      ) : null}
                    </div>
                    
                    {/* Story info */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(story.timestamp).toLocaleDateString()}
                      </p>
                      {story.fileType === 'pdf' && story.fileName && (
                        <p className="text-xs text-gray-700 truncate font-medium">
                          {story.fileName.replace('.pdf', '')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {story.fileType === 'pdf' && (
                      <button
                        onClick={(e) => handleDownloadPdf(story, e)}
                        className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteStory(story.id, e)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Story viewer */}
      <StoryViewer
        stories={expiredStories}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={handleCloseViewer}
        onStoryViewed={() => {}} // No need to mark expired stories as viewed
      />
    </div>
  );
};

export default ExpiredStoriesPage;