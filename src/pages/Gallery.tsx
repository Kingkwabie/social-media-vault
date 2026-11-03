import React, { useEffect, useState } from ‘react’;
import {
Play,
Share2,
Trash2,
Search,
LayoutGrid,
List,
Video
} from ‘lucide-react’;
import { Card } from ‘@/components/ui/card’;
import { Button } from ‘@/components/ui/button’;
import { Input } from ‘@/components/ui/input’;
import { useDownloads, DownloadItem } from ‘@/context/DownloadContext’;
import { Tabs, TabsList, TabsTrigger } from ‘@/components/ui/tabs’;
import { toast } from ‘sonner’;

const Gallery: React.FC = () => {
const { downloads, cancelDownload } = useDownloads();
const [viewMode, setViewMode] = useState<‘grid’ | ‘list’>(‘grid’);
const [search, setSearch] = useState(’’);
const [filter, setFilter] = useState(‘all’);

const completed = downloads.filter(
item => item.status === ‘completed’
);

const filtered = completed.filter(item => {
const matchesSearch =
item.title.toLowerCase().includes(search.toLowerCase()) ||
item.platform.toLowerCase().includes(search.toLowerCase());

const matchesFilter =
  filter === 'all' || item.type === filter;
return matchesSearch && matchesFilter;

});

return (
My Gallery
{completed.length} saved videos
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
        size="icon"
        className="w-8 h-8"
        onClick={() => setViewMode('grid')}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
        size="icon"
        className="w-8 h-8"
        onClick={() => setViewMode('list')}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  </div>
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input
      className="pl-9 bg-muted/50 border-none rounded-xl"
      placeholder="Search your gallery..."
      value={search}
      onChange={event => setSearch(event.target.value)}
    />
  </div>
  <Tabs value={filter} onValueChange={setFilter}>
    <TabsList className="w-full grid grid-cols-2">
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="video">Videos</TabsTrigger>
    </TabsList>
  </Tabs>
  {filtered.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4 text-center">
      <Video className="w-10 h-10 opacity-30" />
      <div>
        <p className="text-sm font-bold">
          Your gallery is empty
        </p>
        <p className="text-xs">
          Completed downloads will appear here.
        </p>
      </div>
    </div>
  ) : (
    <div className={
      viewMode === 'grid'
        ? 'grid grid-cols-2 gap-3'
        : 'space-y-3'
    }>
      {filtered.map(item => (
        <MediaCard
          key={item.id}
          item={item}
          viewMode={viewMode}
          onDelete={() => cancelDownload(item.id)}
        />
      ))}
    </div>
  )}
</div>

);
};

const MediaCard = ({
item,
viewMode,
onDelete
}: {
item: DownloadItem;
viewMode: ‘grid’ | ‘list’;
onDelete: () => void;
}) => {
const { getVideoBlob } = useDownloads();
const [videoUrl, setVideoUrl] = useState(’’);

useEffect(() => {
let objectUrl = ‘’;

getVideoBlob(item.id)
  .then(blob => {
    if (blob) {
      objectUrl = URL.createObjectURL(blob);
      setVideoUrl(objectUrl);
    }
  })
  .catch(() => {
    toast.error('Could not load saved video');
  });
return () => {
  if (objectUrl) URL.revokeObjectURL(objectUrl);
};

}, [item.id, getVideoBlob]);

const handleShare = async () => {
if (!videoUrl) {
toast.error(‘Video is not available’);
return;
}

try {
  const blob = await getVideoBlob(item.id);
  if (!blob) throw new Error('Video file not found');
  const file = new File(
    [blob],
    'social-video.mp4',
    { type: blob.type || 'video/mp4' }
  );
  if (
    navigator.share &&
    (!navigator.canShare || navigator.canShare({ files: [file] }))
  ) {
    await navigator.share({
      files: [file],
      title: item.title
    });
  } else {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'social-video.mp4';
    link.click();
    toast.success('Video ready to save');
  }
} catch (error) {
  if (error instanceof Error && error.name !== 'AbortError') {
    toast.error('Could not share video');
  }
}

};

return (
{videoUrl ? (
<video
src={videoUrl}
controls
playsInline
preload=“metadata”
className={
viewMode === ‘grid’
? ‘w-full aspect-[4/5] object-cover’
: ‘w-24 h-24 object-cover rounded-lg’
}
/>
) : (
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
