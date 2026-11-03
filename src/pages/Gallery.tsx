import React, { useEffect, useState } from 'react';
import { Share2, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDownloads, DownloadItem } from '@/context/DownloadContext';

const Gallery: React.FC = () => {
  const { downloads, cancelDownload } = useDownloads();

  const completedDownloads = downloads.filter(
    (item) => item.status === 'completed'
  );

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">My Gallery</h2>

      {completedDownloads.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Download className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No videos saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {completedDownloads.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onDelete={() => cancelDownload(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface MediaCardProps {
  item: DownloadItem;
  onDelete: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onDelete }) => {
  const { getVideoBlob } = useDownloads();
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    let objectUrl = '';
    let cancelled = false;

    const loadVideo = async () => {
      try {
        const blob = await getVideoBlob(item.id);

        if (blob && !cancelled) {
          objectUrl = URL.createObjectURL(blob);
          setVideoUrl(objectUrl);
        }
      } catch (error) {
        console.error('Could not load saved video:', error);
      }
    };

    loadVideo();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [item.id, getVideoBlob]);

  const handleShare = async () => {
    try {
      const blob = await getVideoBlob(item.id);

      if (!blob) return;

      const file = new File([blob], 'social-video.mp4', {
        type: blob.type || 'video/mp4'
      });

      if (typeof navigator.share === 'function') {
        await navigator.share({
          files: [file]
        });
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'social-video.mp4';
        link.click();

        setTimeout(() => URL.revokeObjectURL(link.href), 60000);
      }
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  return (
    <Card className="overflow-hidden">
      {videoUrl ? (
        <video
          src={videoUrl}
          controls
          playsInline
          preload="metadata"
          className="w-full aspect-[4/5] object-cover"
        />
      ) : (
        <div className="w-full aspect-[4/5] bg-muted flex items-center justify-center">
          <Download className="w-8 h-8 opacity-30" />
        </div>
      )}

      <div className="p-3 space-y-2">
        <h3 className="text-xs font-bold truncate">
          {item.title}
        </h3>

        <p className="text-[10px] text-muted-foreground">
          {item.platform} • {item.size}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={!videoUrl}
            onClick={handleShare}
          >
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Gallery;
