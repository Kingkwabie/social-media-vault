import React from ‘react’;
import {
X,
Download,
CheckCircle2,
AlertCircle,
Clock,
Loader2
} from ‘lucide-react’;
import { Progress } from ‘@/components/ui/progress’;
import { Button } from ‘@/components/ui/button’;
import { Card } from ‘@/components/ui/card’;
import { useDownloads, DownloadItem } from ‘@/context/DownloadContext’;

const DownloadManager: React.FC = () => {
const { downloads, cancelDownload } = useDownloads();

const activeDownloads = downloads.filter(
item => item.status === ‘downloading’ || item.status === ‘paused’
);

const completedDownloads = downloads.filter(
item => item.status === ‘completed’
);

const failedDownloads = downloads.filter(
item => item.status === ‘failed’
);

return (
Download Queue
{activeDownloads.length} Active
  {downloads.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
      <Download className="w-10 h-10 opacity-30" />
      <p className="text-sm font-medium">Your queue is empty</p>
    </div>
  ) : (
    <>
      {activeDownloads.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold">Active downloads</h3>
          {activeDownloads.map(item => (
            <DownloadCard
              key={item.id}
              item={item}
              onRemove={() => cancelDownload(item.id)}
            />
          ))}
        </section>
      )}
      {completedDownloads.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold">
            Completed ({completedDownloads.length})
          </h3>
          {completedDownloads.map(item => (
            <DownloadCard
              key={item.id}
              item={item}
              onRemove={() => cancelDownload(item.id)}
            />
          ))}
        </section>
      )}
      {failedDownloads.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold">
            Failed ({failedDownloads.length})
          </h3>
          {failedDownloads.map(item => (
            <DownloadCard
              key={item.id}
              item={item}
              onRemove={() => cancelDownload(item.id)}
            />
          ))}
        </section>
      )}
    </>
  )}
</div>

);
};

const DownloadCard = ({
item,
onRemove
}: {
item: DownloadItem;
onRemove: () => void;
}) => {
const isCompleted = item.status === ‘completed’;
const isFailed = item.status === ‘failed’;

return (
{item.thumbnail ? (
) : (
)}
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-xs font-bold truncate">
          {item.title}
        </h3>
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Remove download"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
        {isCompleted ? (
          <CheckCircle2 className="w-3 h-3 text-green-500" />
        ) : isFailed ? (
          <AlertCircle className="w-3 h-3 text-destructive" />
        ) : item.status === 'paused' ? (
          <Clock className="w-3 h-3 text-yellow-500" />
        ) : (
          <Loader2 className="w-3 h-3 animate-spin text-primary" />
        )}
        <span className={
          isCompleted
            ? 'text-green-500'
            : isFailed
              ? 'text-destructive'
              : 'text-muted-foreground'
        }>
          {isCompleted
            ? 'Completed'
            : isFailed
              ? 'Failed'
              : item.status === 'paused'
                ? 'Paused'
                : 'Downloading'}
        </span>
      </div>
      <Progress
        value={isCompleted ? 100 : item.progress}
        className="h-1.5"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{item.platform} • {item.quality}</span>
        <span>
          {isCompleted ? item.size : `${item.progress.toFixed(0)}%`}
        </span>
      </div>
    </div>
  </div>
</Card>

);
};

export default DownloadManager;
