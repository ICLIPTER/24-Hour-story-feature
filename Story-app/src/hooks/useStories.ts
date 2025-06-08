import { useState, useEffect, useCallback } from 'react';
import { Story } from '../types/story';

const STORIES_KEY = 'app-stories';
const EXPIRED_STORIES_KEY = 'app-expired-stories';
const STORY_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [expiredStories, setExpiredStories] = useState<Story[]>([]);

  // Load stories from localStorage on mount
  useEffect(() => {
    loadStories();
    loadExpiredStories();
  }, []);

  // Set up cleanup interval to move expired stories
  useEffect(() => {
    const interval = setInterval(() => {
      moveExpiredStories();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const loadStories = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORIES_KEY);
      if (stored) {
        const parsedStories: Story[] = JSON.parse(stored);
        // Filter out expired stories
        const validStories = parsedStories.filter(
          story => Date.now() - story.timestamp < STORY_EXPIRY
        );
        setStories(validStories);
        
        // Update localStorage if we filtered out expired stories
        if (validStories.length !== parsedStories.length) {
          localStorage.setItem(STORIES_KEY, JSON.stringify(validStories));
        }
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      setStories([]);
    }
  }, []);

  const loadExpiredStories = useCallback(() => {
    try {
      const stored = localStorage.getItem(EXPIRED_STORIES_KEY);
      if (stored) {
        const parsedStories: Story[] = JSON.parse(stored);
        setExpiredStories(parsedStories);
      }
    } catch (error) {
      console.error('Error loading expired stories:', error);
      setExpiredStories([]);
    }
  }, []);

  const addStory = useCallback((fileData: string, fileType: 'image' | 'pdf', fileName?: string) => {
    const newStory: Story = {
      id: Date.now().toString(),
      ...(fileType === 'image' ? { imageData: fileData } : { pdfData: fileData }),
      fileName,
      fileType,
      timestamp: Date.now(),
      viewed: false,
    };

    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    localStorage.setItem(STORIES_KEY, JSON.stringify(updatedStories));
  }, [stories]);

  const markAsViewed = useCallback((storyId: string) => {
    const updatedStories = stories.map(story =>
      story.id === storyId ? { ...story, viewed: true } : story
    );
    setStories(updatedStories);
    localStorage.setItem(STORIES_KEY, JSON.stringify(updatedStories));
  }, [stories]);

  const moveExpiredStories = useCallback(() => {
    const now = Date.now();
    const validStories: Story[] = [];
    const newExpiredStories: Story[] = [];

    stories.forEach(story => {
      if (now - story.timestamp >= STORY_EXPIRY) {
        newExpiredStories.push({ ...story, expired: true });
      } else {
        validStories.push(story);
      }
    });

    if (newExpiredStories.length > 0) {
      const updatedExpiredStories = [...newExpiredStories, ...expiredStories];
      setStories(validStories);
      setExpiredStories(updatedExpiredStories);
      localStorage.setItem(STORIES_KEY, JSON.stringify(validStories));
      localStorage.setItem(EXPIRED_STORIES_KEY, JSON.stringify(updatedExpiredStories));
    }
  }, [stories, expiredStories]);

  const deleteExpiredStory = useCallback((storyId: string) => {
    const updatedExpiredStories = expiredStories.filter(story => story.id !== storyId);
    setExpiredStories(updatedExpiredStories);
    localStorage.setItem(EXPIRED_STORIES_KEY, JSON.stringify(updatedExpiredStories));
  }, [expiredStories]);

  const clearAllExpiredStories = useCallback(() => {
    setExpiredStories([]);
    localStorage.removeItem(EXPIRED_STORIES_KEY);
  }, []);

  const getTimeRemaining = useCallback((timestamp: number) => {
    const timeLeft = STORY_EXPIRY - (Date.now() - timestamp);
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    return Math.max(0, hours);
  }, []);

  return {
    stories,
    expiredStories,
    addStory,
    markAsViewed,
    deleteExpiredStory,
    clearAllExpiredStories,
    getTimeRemaining,
    moveExpiredStories,
  };
};