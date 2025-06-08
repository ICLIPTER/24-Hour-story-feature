import React, { useState } from 'react';
import { Archive } from 'lucide-react';
import StoriesContainer from './components/StoriesContainer';
import ExpiredStoriesPage from './components/ExpiredStoriesPage';
import { useStories } from './hooks/useStories';

function App() {
  const [currentPage, setCurrentPage] = useState<'stories' | 'expired'>('stories');
  const { expiredStories } = useStories();

  const handleShowExpired = () => {
    setCurrentPage('expired');
  };

  const handleBackToStories = () => {
    setCurrentPage('stories');
  };

  if (currentPage === 'expired') {
    return <ExpiredStoriesPage onBack={handleBackToStories} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Stories</h1>
          <button
            onClick={handleShowExpired}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors relative"
          >
            <Archive className="w-5 h-5" />
            <span className="text-sm font-medium">Archive</span>
            {expiredStories.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {expiredStories.length > 9 ? '9+' : expiredStories.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-md mx-auto">
        <StoriesContainer />
        
        {/* Instructions */}
        <div className="p-4 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">How it works</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Tap the + button to add images or PDF files</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Stories automatically expire after 24 hours</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Swipe or use arrow keys to navigate between stories</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Images are resized to 1080x1920 max, PDFs up to 50MB</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>View expired stories in the Archive section</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;