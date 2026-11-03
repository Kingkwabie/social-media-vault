import React, { useState } from ‘react’;
import { motion, AnimatePresence } from ‘framer-motion’;
import { Info, Trash2, Clipboard, Image as ImageIcon } from ‘lucide-react’;
import { Input } from ‘@/components/ui/input’;
import { Button } from ‘@/components/ui/button’;
import { Card } from ‘@/components/ui/card’;
import { toast } from ‘sonner’;
import { useDownloads } from ‘@/context/DownloadContext’;

interface PreviewData {
title: string;
platform: string;
thumbnail: string;
videoUrl: string;
qualities: { quality: string; url: string }[];
}

const UrlDownloader: React.FC = () => {
const {
startDownload,
completeDownload,
failDownload,
updateProgress
} = useDownloads();

const [url, setUrl] = useState(’’);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [isDownloading, setIsDownloading] = useState(false);
const [preview, setPreview] = useState<PreviewData | null>(null);
const [thumbnailFailed, setThumbnailFailed] = useState(false);

const handlePaste = async () => {
try {
const text = await navigator.clipboard.readText();
setUrl(text);
setPreview(null);
toast.info(‘Pasted from clipboard’);
} catch {
toast.error(‘Could not read clipboard’);
}
};

const handleAnalyze = async () => {
if (!url.trim()) return;

setIsAnalyzing(true);
setPreview(null);
setThumbnailFailed(false);
try {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: url.trim()
    })
  });
  const data = await response.json();
  if (
    !response.ok ||
    !data.success ||
    !data.mediaInfo?.videoUrl
  ) {
    throw new Error(
      data.error || 'Could not extract this video'
    );
  }
  const media = data.mediaInfo;
  const thumbnail =
    typeof media.thumbnail === 'string' &&
    media.thumbnail.startsWith('https://')
      ? media.thumbnail
      : '';
  setPreview({
    title: media.title || 'Social Media Video',
    platform: media.platform || 'Unknown',
    thumbnail,
    videoUrl: media.videoUrl,
    qualities: Array.isArray(media.qualities)
      ? media.qualities
      : []
  });
  toast.success('Video found successfully!');
} catch (error) {
  toast.error(
    error instanceof Error
      ? error.message
      : 'Something went wrong'
  );
} finally {
  setIsAnalyzing(false);
}

};

const handleDownload = async (quality: ‘HD’ | ‘SD’) => {
if (!preview || isDownloading) return;

let downloadUrl = preview.videoUrl;
const selected = preview.qualities.find(item =>
  quality === 'HD'
    ? /720p|1080p|1440p|2160p/i.test(item.quality)
    : /360p|480p/i.test(item.quality)
);
if (selected?.url) {
  downloadUrl = selected.url;
}
const downloadId = startDownload(
  downloadUrl,
  preview.platform,
  {
    title: preview.title,
    thumbnail: preview.thumbnail,
    quality,
    type: 'video'
  }
);
setIsDownloading(true);
try {
  const response = await fetch(
    `/api/download?url=${encodeURIComponent(downloadUrl)}`
  );
  if (!response.ok) {
    let message = 'Download failed';
    try {
      const error = await response.json();
      message = error.error || message;
    } catch {
      // Use default error message.
    }
    throw new Error(message);
  }
  const contentType = (
    response.headers.get('content-type') || ''
  ).toLowerCase();
  if (
    !contentType.startsWith('video/') &&
    contentType !== 'application/octet-stream'
  ) {
    throw new Error(
      'The server returned an image or unsupported file instead of a video.'
    );
  }
  const blob = await response.blob();
  if (!blob.size) {
    throw new Error('The downloaded video is empty');
  }
  updateProgress(downloadId, 99);
  await completeDownload(downloadId, blob);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'social-video.mp4';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 60000);
  toast.success('Video saved to your app Gallery!');
} catch (error) {
  failDownload(downloadId);
  toast.error(
    error instanceof Error
      ? error.message
      : 'Download failed'
  );
} finally {
  setIsDownloading(false);
}

};

return (
Paste URL to Download
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          placeholder="Paste link here..."
          value={url}
          onChange={e => {
            setUrl(e.target.value);
            setPreview(null);
          }}
          className="pr-10 h-12 rounded-xl"
        />
        {url && (
          <button
            onClick={() => {
              setUrl('');
              setPreview(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="h-12 w-12 rounded-xl bg-primary/10 text-primary"
        onClick={handlePaste}
      >
        <Clipboard className="w-5 h-5" />
      </Button>
    </div>
    <Button
      className="w-full h-12 rounded-xl text-lg font-bold"
      onClick={handleAnalyze}
      disabled={!url.trim() || isAnalyzing}
    >
      {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
    </Button>
  </div>
  <AnimatePresence>
    {preview && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="space-y-4"
      >
        <Card className="overflow-hidden border-none shadow-xl bg-card">
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            {preview.thumbnail && !thumbnailFailed ? (
              <img
                src={preview.thumbnail}
                className="w-full h-full object-cover"
                alt="Video thumbnail"
                onError={() => setThumbnailFailed(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImageIcon className="w-10 h-10" />
                <span className="text-xs">
                  Thumbnail unavailable
                </span>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] text-white font-bold uppercase">
              {preview.platform}
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-sm font-medium">
              {preview.title}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                disabled={isDownloading}
                onClick={() => handleDownload('SD')}
              >
                {isDownloading ? 'Downloading...' : 'Download SD'}
              </Button>
              <Button
                disabled={isDownloading}
                onClick={() => handleDownload('HD')}
              >
                {isDownloading ? 'Downloading...' : 'Download HD'}
              </Button>
            </div>
          </div>
        </Card>
        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg text-yellow-600 dark:text-yellow-400">
          <Info className="w-4 h-4" />
          <p className="text-[10px] font-medium">
            Please ensure you have permission to download this content.
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
  <div className="pt-8">
    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
      How to download?
    </h3>
    <div className="space-y-4">
      {[
        { step: 1, text: 'Copy the video link from social apps.' },
        { step: 2, text: 'Paste the link in the input box above.' },
        { step: 3, text: 'Click analyze and choose your quality.' }
      ].map(item => (
        <div key={item.step} className="flex gap-4 items-start">
          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
            {item.step}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>

);
};

export default UrlDownloader;
