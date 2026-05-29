import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pause, 
  Play, 
  X, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDownloads, DownloadItem } from '@/context/DownloadContext';

const DownloadManager: React.FC = () => {
  const { downloads, pauseDownload, resumeDownload, cancelDownload } = useDownloads();
  const activeDownloads = downloads.filter(d => d.status !== 'completed');

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Download Queue</h2>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
          {activeDownloads.length} Active
        </span>
      </div>

      {activeDownloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Download className="w-8 h-8 opacity-20" />
          </div>
          <p className="text-sm font-medium">No active downloads</p>
        </div>
      ) : ( activeDownloads.map((item) => (
        <DownloadCard 
          key={item.id} 
          item={item} 
          onPause={() => pauseDownload(item.id)}
          onResume={() => resumeDownload(item.id)}
          onCancel={() => cancelDownload(item.id)}
        />
      )))}

      {/* Ad Placeholder */}
      <div className="pt-4">
        <Card className="bg-indigo-600/5 border-indigo-600/10 p-4 border-dashed border-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold uppercase text-indigo-600">Pro Feature</p>
              <p className="text-sm font-medium">Turbo Download Speed</p>
            </div>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Unlock</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const DownloadCard = ({ 
  item, 
  onPause, 
  onResume, 
  onCancel 
}: { 
  item: DownloadItem; 
  onPause: () => void; 
  onResume: () => void; 
  onCancel: () => void;
}) => {
  return (
    <Card className="p-3 border-none shadow-sm overflow-hidden">
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <img src={item.thumbnail} className="w-full h-full object-cover" alt={item.title} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold truncate pr-6">{item.title}</h3>
            <button onClick={onCancel} className="text-muted-foreground hover:text-destructive">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
              <span>{item.status}</span>
              <span>{item.progress.toFixed(0)}%</span>
            </div>
            <Progress value={item.progress} className="h-1.5" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-medium">{item.size} • {item.quality}</span>
            <div className="flex gap-2">
              {item.status === 'downloading' ? (
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={onPause}>
                  <Pause className="w-4 h-4 fill-current" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={onResume}>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DownloadManager;