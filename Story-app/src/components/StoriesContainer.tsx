import React, { useState } from 'react';
import { useStories } from '../hooks/useStories';
import StoryThumbnail from './StoryThumbnail';
import AddStoryButton from './AddStoryButton';
import StoryViewer from './StoryViewer';

const StoriesContainer: React.FC = () => {
  const { stories, addStory, markAsViewed, getTimeRemaining } = useStories();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const handleAddStory = (fileData: string, fileType: 'image' | 'pdf', fileName?: string) => {
    addStory(fileData, fileType, fileName);
  };

  const handleStoryClick = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  const handleStoryViewed = (storyId: string) => {
    markAsViewed(storyId);
  };

  return (
    <div className="w-full">
      {/* Stories list */}
      <div className="flex items-center space-x-4 p-4 overflow-x-auto scrollbar-hide">
        <AddStoryButton onAddStory={handleAddStory} />
        
        {stories.map((story, index) => (
          <StoryThumbnail
            key={story.id}
            story={story}
            onClick={() => handleStoryClick(index)}
            timeRemaining={getTimeRemaining(story.timestamp)}
          />
        ))}
      </div>

      {/* Empty state */}
      {stories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">No stories yet</p>
          <p className="text-sm">Tap the + button to add your first story!</p>
        </div>
      )}

      {/* Story viewer */}
      <StoryViewer
        stories={stories}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={handleCloseViewer}
        onStoryViewed={handleStoryViewed}
      />
    </div>
  );
};

export default StoriesContainer;