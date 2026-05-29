import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Info, Settings2, Trash2, Clipboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDownloads } from '@/context/DownloadContext';
import { toast } from 'sonner';

const UrlDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const { startDownload } = useDownloads();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<null | { title: string; platform: string; thumb: string }>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      toast.info('Pasted from clipboard');
    } catch (err) {
      toast.error('Could not read clipboard');
    }
  };

  const handleAnalyze = () => {
    if (!url) return;
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      let platform = 'Unknown';
      if (url.includes('instagram.com')) platform = 'Instagram';
      if (url.includes('facebook.com')) platform = 'Facebook';
      if (url.includes('tiktok.com')) platform = 'TikTok';
      if (url.includes('twitter.com') || url.includes('x.com')) platform = 'X / Twitter';

      setPreview({
        title: 'Amazing Social Media Video content with high production value...',
        platform,
        thumb: `https://picsum.photos/seed/${Math.random()}/800/450`
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleDownload = (quality: 'HD' | 'SD') => {
    if (!preview) return;
    startDownload(url, preview.platform);
    setUrl('');
    setPreview(null);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Paste URL to Download</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input 
              placeholder="Paste link here..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pr-10 h-12 rounded-xl"
            />
            {url && (
              <button 
                onClick={() => setUrl('')}
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
          disabled={!url || isAnalyzing}
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
              <div className="relative aspect-video">
                <img src={preview.thumb} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase">
                  {preview.platform}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm font-medium line-clamp-2">{preview.title}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/20 hover:bg-primary/5"
                    onClick={() => handleDownload('SD')}
                  >
                    Download SD
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => handleDownload('HD')}
                  >
                    Download HD
                  </Button>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg text-yellow-600 dark:text-yellow-400">
              <Info className="w-4 h-4" />
              <p className="text-[10px] font-medium">Please ensure you have permission to download this content.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">How to download?</h3>
        <div className="space-y-4">
          {[
            { step: 1, text: 'Copy the video link from social apps.' },
            { step: 2, text: 'Paste the link in the input box above.' },
            { step: 3, text: 'Click analyze and choose your quality.' }
          ].map(s => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                {s.step}
              </div>
              <p className="text-sm text-muted-foreground font-medium">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UrlDownloader;