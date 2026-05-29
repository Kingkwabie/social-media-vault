import React, { useState } from 'react';
import { 
  Play, 
  Share2, 
  Trash2, 
  Search, 
  LayoutGrid, 
  List,
  Video,
  Image as ImageIcon,
  MoreVertical
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDownloads, DownloadItem } from '@/context/DownloadContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Gallery: React.FC = () => {
  const { downloads, cancelDownload } = useDownloads();
  const completed = downloads.filter(d => d.status === 'completed');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const filtered = completed.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">My Downloads</h2>
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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-transparent border-b rounded-none h-10 p-0">
          <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">All</TabsTrigger>
          <TabsTrigger value="video" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Videos</TabsTrigger>
          <TabsTrigger value="image" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">Images</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Video className="w-8 h-8 opacity-20" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold">Your gallery is empty</p>
            <p className="text-xs">Start downloading videos to see them here.</p>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {filtered.map((item) => (
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
  viewMode: 'grid' | 'list';
  onDelete: () => void;
}) => {
  if (viewMode === 'list') {
    return (
      <Card className="p-2 border-none bg-muted/30 flex gap-3 items-center">
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
          <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Play className="w-6 h-6 text-white fill-current" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold truncate">{item.title}</h3>
          <p className="text-[10px] text-muted-foreground mt-1">{item.platform} • {item.size}</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none bg-muted/30 group">
      <div className="aspect-[4/5] relative">
        <img src={item.thumbnail} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-white rounded-full bg-black/20 backdrop-blur-md">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}} className="gap-2">
                <Share2 className="w-4 h-4" /> Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive">
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <h3 className="text-[10px] font-bold truncate mb-1">{item.title}</h3>
          <div className="flex justify-between items-center">
            <span className="text-[8px] uppercase font-black opacity-80">{item.platform}</span>
            <Play className="w-4 h-4 fill-current" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Gallery;