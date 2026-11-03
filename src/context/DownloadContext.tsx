import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';
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

  startDownload: (
    url: string,
    platform: string,
    metadata?: {
      title?: string;
      thumbnail?: string;
      quality?: 'HD' | 'SD';
      type?: 'video' | 'image';
    }
  ) => string;

  completeDownload: (id: string, blob: Blob) => Promise<void>;
  getVideoBlob: (id: string) => Promise<Blob | null>;

  updateDownloadInfo: (
    id: string,
    metadata: {
      title?: string;
      thumbnail?: string;
      platform?: string;
    }
  ) => void;

  updateProgress: (id: string, progress: number) => void;
  failDownload: (id: string) => void;
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

const DB_NAME = 'SocialMediaVaultDB';
const STORE_NAME = 'videos';

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveVideoFile = async (id: string, blob: Blob) => {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');

    transaction.objectStore(STORE_NAME).put(blob, id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

const readVideoFile = async (id: string): Promise<Blob | null> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(id);

    request.onsuccess = () => {
      const result = request.result || null;
      db.close();
      resolve(result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
};

const deleteVideoFile = async (id: string) => {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');

    transaction.objectStore(STORE_NAME).delete(id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

const DownloadContext = createContext<
  DownloadContextType | undefined
>(undefined);

export const DownloadProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    try {
      const saved = localStorage.getItem('app-downloads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'app-downloads',
      JSON.stringify(downloads)
    );
  }, [downloads]);

  const startDownload = (
    url: string,
    platform: string,
    metadata?: {
      title?: string;
      thumbnail?: string;
      quality?: 'HD' | 'SD';
      type?: 'video' | 'image';
    }
  ) => {
    const id = crypto.randomUUID();

    const newItem: DownloadItem = {
      id,
      title: metadata?.title || `Video from ${platform}`,
      url,
      thumbnail: metadata?.thumbnail || '',
      platform,
      quality: metadata?.quality || 'HD',
      progress: 0,
      status: 'downloading',
      timestamp: Date.now(),
      size: 'Calculating...',
      type: metadata?.type || 'video'
    };

    setDownloads(previous => [newItem, ...previous]);

    return id;
  };

  const updateDownloadInfo = (
    id: string,
    metadata: {
      title?: string;
      thumbnail?: string;
      platform?: string;
    }
  ) => {
    setDownloads(previous =>
      previous.map(item =>
        item.id === id
          ? {
              ...item,
              ...(metadata.title
                ? { title: metadata.title }
                : {}),
              ...(metadata.thumbnail
                ? { thumbnail: metadata.thumbnail }
                : {}),
              ...(metadata.platform
                ? { platform: metadata.platform }
                : {})
            }
          : item
      )
    );
  };

  const updateProgress = (
    id: string,
    progress: number
  ) => {
    setDownloads(previous =>
      previous.map(item =>
        item.id === id
          ? {
              ...item,
              progress: Math.min(99, Math.max(0, progress))
            }
          : item
      )
    );
  };

  const completeDownload = async (
    id: string,
    blob: Blob
  ) => {
    try {
      if (!blob || blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      await saveVideoFile(id, blob);

      const size = (
        blob.size / (1024 * 1024)
      ).toFixed(1);

      setDownloads(previous =>
        previous.map(item =>
          item.id === id
            ? {
                ...item,
                progress: 100,
                status: 'completed',
                size: `${size} MB`
              }
            : item
        )
      );

      toast.success('Video saved to Gallery!');

    } catch (error) {
      console.error('Saving download failed:', error);

      setDownloads(previous =>
        previous.map(item =>
          item.id === id
            ? {
                ...item,
                status: 'failed'
              }
            : item
        )
      );

      toast.error('Could not save video');
      throw error;
    }
  };

  const failDownload = (id: string) => {
    setDownloads(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, status: 'failed' }
          : item
      )
    );
  };

  const pauseDownload = (id: string) => {
    setDownloads(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, status: 'paused' }
          : item
      )
    );
  };

  const resumeDownload = (id: string) => {
    setDownloads(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, status: 'downloading' }
          : item
      )
    );
  };

  const cancelDownload = (id: string) => {
    deleteVideoFile(id).catch(console.error);

    setDownloads(previous =>
      previous.filter(item => item.id !== id)
    );
  };

  const clearHistory = () => {
    downloads.forEach(item => {
      deleteVideoFile(item.id).catch(console.error);
    });

    setDownloads([]);

    toast.success('Download history cleared');
  };

  const stats = {
    totalDownloaded: downloads.filter(
      item => item.status === 'completed'
    ).length,

    totalSize: downloads
      .filter(item => item.status === 'completed')
      .reduce(
        (total, item) =>
          total + parseFloat(item.size || '0'),
        0
      )
      .toFixed(1) + ' MB',

    favorites: 0
  };

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        startDownload,
        completeDownload,
        getVideoBlob: readVideoFile,
        updateDownloadInfo,
        updateProgress,
        failDownload,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        clearHistory,
        stats
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadContext);

  if (!context) {
    throw new Error(
      'useDownloads must be used within DownloadProvider'
    );
  }

  return context;
};
