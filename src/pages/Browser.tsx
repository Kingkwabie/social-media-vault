import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setShowFallback(false);

    const timer = setTimeout(() => {
      setLoading(false);
      setShowFallback(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [url]);

  const openWebsite = (address: string) => {
    let formatted = address.trim();

    if (!formatted) {
      toast.error('Enter a website address first.');
      return;
    }

    if (!/^https?:\/\//i.test(formatted)) {
      formatted = 'https://' + formatted;
    }

    try {
      const parsed = new URL(formatted);

      if (!['https:', 'http:'].includes(parsed.protocol)) {
        toast.error('Invalid website address.');
        return;
      }

      formatted = parsed.href;

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
    setLoading(false);
    setShowFallback(false);
  };

  const reloadPage = () => {
    if (url) {
      setLoading(true);
      setShowFallback(false);
      setUrl('');
      setTimeout(() => setUrl(url), 100);
    }
  };

  const openExternal = () => {
    if (!url) return;

    const opened = window.open(url, '_blank');

    if (!opened) {
      window.location.assign(url);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">

      <div className="p-3 border-b border-border bg-card space-y-3">

        <div className="flex gap-2">
          <Input
            className="h-11 text-sm"
            placeholder="Search or enter website..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                openWebsite(inputUrl);
              }
            }}
          />

          <Button
            onClick={() => openWebsite(inputUrl)}
            className="h-11"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-5">

            <button
              onClick={goBack}
              disabled={historyIndex <= 0}
              className="disabled:opacity-30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
              className="disabled:opacity-30"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <button onClick={reloadPage}>
              <RotateCcw className="w-5 h-5" />
            </button>

            <button onClick={goHome}>
              <HomeIcon className="w-5 h-5" />
            </button>

          </div>

          <div className="flex items-center gap-1 text-xs text-green-500 font-bold">
            <ShieldCheck className="w-4 h-4" />
            HTTPS
          </div>

        </div>
      </div>

      <div className="flex-1 min-h-0 relative bg-white dark:bg-background">

        {!url ? (

          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-5">

            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-10 h-10 text-primary" />
            </div>

            <div>
              <h3 className="text-xl font-bold">
                Social Media Vault Browser
              </h3>

              <p className="text-sm text-muted-foreground mt-2">
                Enter a website address to start browsing.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => openWebsite('https://example.com')}
            >
              Test Browser
            </Button>

          </div>

        ) : (

          <>
            <iframe
              key={url}
              src={url}
              title="Social Media Vault Browser"
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => {
                setLoading(false);
              }}
            />

            {loading && (
              <div className="absolute top-2 left-2 right-2 bg-card p-3 rounded-lg shadow text-center text-sm">
                Loading website...
              </div>
            )}

            {showFallback && (
              <div className="absolute bottom-3 left-3 right-3 bg-card border rounded-xl p-4 shadow-lg text-center space-y-3">

                <p className="text-sm font-medium">
                  Is the website not displaying?
                </p>

                <p className="text-xs text-muted-foreground">
                  Some websites block embedded browsing. Try opening the website separately.
                </p>

                <Button
                  className="w-full"
                  onClick={openExternal}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Website
                </Button>

              </div>
            )}
          </>
        )}

      </div>

      {url && (
        <div className="p-2 border-t bg-card flex items-center justify-between gap-2">

          <span className="text-xs truncate text-muted-foreground">
            {url}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={openExternal}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Open
          </Button>

        </div>
      )}

      <Button
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-xl z-[60]"
        onClick={() => {
          toast.info('Open a supported video page to download its media.');
        }}
      >
        <Download className="w-6 h-6" />
      </Button>

    </div>
  );
};

export default Browser;
