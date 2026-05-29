import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface DownloadItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  platform: string;
  quality: 'HD' | 'SD';
  progress: number;
  status: 'downloading' | 'completed' | 'paused' | 'failed';
  timestamp: number;
  size: string;
  type: 'video' | 'image';
}

interface DownloadContextType {
  downloads: DownloadItem[];
  startDownload: (url: string, platform: string) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  cancelDownload: (id: string) => void;
  clearHistory: () => void;
  stats: {
    totalDownloaded: number;
    totalSize: string;
    favorites: number;
  };
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    const saved = localStorage.getItem('app-downloads');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('app-downloads', JSON.stringify(downloads));
  }, [downloads]);

  // Mock download progress effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads(current => 
        current.map(item => {
          if (item.status === 'downloading' && item.progress < 100) {
            const newProgress = Math.min(item.progress + Math.random() * 15, 100);
            return {
              ...item,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'downloading'
            };
          }
          return item;
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const startDownload = (url: string, platform: string) => {
    const newItem: DownloadItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Video from ${platform}`,
      url,
      thumbnail: `https://picsum.photos/seed/${Math.random()}/400/225`,
      platform,
      quality: 'HD',
      progress: 0,
      status: 'downloading',
      timestamp: Date.now(),
      size: (Math.random() * 50 + 10).toFixed(1) + ' MB',
      type: 'video'
    };
    setDownloads(prev => [newItem, ...prev]);
    toast.success('Download started!');
  };

  const pauseDownload = (id: string) => {
    setDownloads(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'paused' } : item
    ));
    toast.info('Download paused');
  };

  const resumeDownload = (id: string) => {
    setDownloads(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'downloading' } : item
    ));
    toast.info('Download resumed');
  };

  const cancelDownload = (id: string) => {
    setDownloads(prev => prev.filter(item => item.id !== id));
    toast.error('Download cancelled');
  };

  const clearHistory = () => {
    setDownloads([]);
    toast.success('History cleared');
  };

  const stats = {
    totalDownloaded: downloads.filter(d => d.status === 'completed').length,
    totalSize: (downloads.filter(d => d.status === 'completed').reduce((acc, d) => acc + parseFloat(d.size), 0)).toFixed(1) + ' MB',
    favorites: 0 // Placeholder
  };

  return (
    <DownloadContext.Provider value={{ downloads, startDownload, pauseDownload, resumeDownload, cancelDownload, clearHistory, stats }}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadContext);
  if (!context) throw new Error('useDownloads must be used within DownloadProvider');
  return context;
};