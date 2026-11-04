import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home as HomeIcon,
  Download,
  ShieldCheck,
  Globe,
  ExternalLink
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const openWebsite = (address: string) => {
    let formatted = address.trim();

    if (!formatted) return;

    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }

    try {
      const parsed = new URL(formatted);

      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        toast.error('Invalid website address');
        return;
      }

      formatted = parsed.href;

      const restrictedSites = [
        'instagram.com',
        'facebook.com',
        'tiktok.com',
        'youtube.com',
        'threads.net',
        'threads.com',
        'snapchat.com',
        'x.com',
        'twitter.com'
      ];

      const hostname = parsed.hostname.toLowerCase();

      const isRestricted = restrictedSites.some(
        site => hostname === site || hostname.endsWith('.' + site)
      );

      if (isRestricted) {
        window.open(formatted, '_blank', 'noopener,noreferrer');
        toast.info('Opening website in a new browser tab.');
        return;
      }

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(formatted);

      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setUrl(formatted);
      setInputUrl(formatted);

    } catch {
      toast.error('Please enter a valid website address.');
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const goHome = () => {
    setUrl('');
    setInputUrl('');
  };

  const reloadPage = () => {
    if (url) {
      setUrl('');
      setTimeout(() => setUrl(url), 100);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">

      <div className="p-2 border-b border-border bg-card space-y-2">

        <div className="flex gap-2">
          <Input
            className="h-10 text-sm"
            placeholder="Search or enter URL..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                openWebsite(inputUrl);
              }
            }}
          />

          <Button
            size="sm"
            onClick={() => openWebsite(inputUrl)}
            className="h-10"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between px-2">

          <div className="flex gap-4">

            <button onClick={goBack}>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button onClick={goForward}>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button onClick={reloadPage}>
              <RotateCcw className="w-5 h-5" />
            </button>

            <button onClick={goHome}>
              <HomeIcon className="w-5 h-5" />
            </button>

          </div>

          <div className="flex items-center gap-1 text-xs text-green-500 font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            Secure
          </div>

        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-background">

        {url ? (
          <iframe
            key={url}
            src={url}
            title="Social Media Vault Browser"
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-5">

            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-10 h-10 text-primary" />
            </div>

            <div className="max-w-xs">
              <h3 className="text-xl font-bold">
                Safe Browser Mode
              </h3>

              <p className="text-sm text-muted-foreground mt-2">
                Enter a website address to start browsing.
                Some social-media websites open in a new browser tab.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => openWebsite('https://www.google.com')}
            >
              Open Google
            </Button>

          </div>
        )}

      </div>

      {url && (
        <div className="p-2 border-t flex items-center justify-between">

          <span className="text-xs text-muted-foreground truncate">
            {url}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Open
          </Button>

        </div>
      )}

      <Button
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-2xl z-[60]"
        onClick={() => {
          toast.info('Open a supported video page to find downloadable media.');
        }}
      >
        <Download className="w-6 h-6" />
      </Button>

    </div>
  );
};

export default Browser;
