import React, { useState, useRef } from 'react';
import {
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Home,
  Globe,
  ExternalLink,
  ShieldCheck,
  Download
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Browser: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (address: string) => {
    let formatted = address.trim();

    if (!formatted) {
      toast.error('Enter a website address.');
      return;
    }

    if (!/^https?:\/\//i.test(formatted)) {
      if (formatted.includes('.') && !formatted.includes(' ')) {
        formatted = 'https://' + formatted;
      } else {
        formatted =
          'https://www.google.com/search?q=' +
          encodeURIComponent(formatted);
      }
    }

    try {
      const parsed = new URL(formatted);

      if (!['http:', 'https:'].includes(parsed.protocol)) {
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
      setLoading(true);

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
      setLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setLoading(true);
    }
  };

  const refresh = () => {
    if (url) {
      setLoading(true);

      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
    }
  };

  const goHome = () => {
    setUrl('');
    setInputUrl('');
    setHistory([]);
    setHistoryIndex(-1);
    setLoading(false);
  };

  const openExternal = () => {
    if (!url) return;

    const newWindow = window.open(url, '_blank');

    if (!newWindow) {
      window.location.assign(url);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">

      {/* ADDRESS BAR */}

      <div className="p-3 border-b bg-card space-y-3">

        <div className="flex gap-2">

          <Input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(inputUrl);
            }}
            placeholder="Search or enter website..."
            className="h-11"
          />

          <Button
            onClick={() => navigate(inputUrl)}
            className="h-11"
          >
            <Search className="w-5 h-5" />
          </Button>

        </div>

        {/* NAVIGATION CONTROLS */}

        <div className="flex justify-between items-center">

          <div className="flex gap-5 items-center">

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

            <button onClick={refresh}>
              <RotateCcw className="w-5 h-5" />
            </button>

            <button onClick={goHome}>
              <Home className="w-5 h-5" />
            </button>

          </div>

          <div className="flex gap-1 items-center text-xs text-green-500">
            <ShieldCheck className="w-4 h-4" />
            Secure
          </div>

        </div>

      </div>

      {/* BROWSER CONTENT */}

      <div className="flex-1 min-h-0 relative">

        {!url ? (

          <div className="h-full flex flex-col items-center justify-center p-6 text-center">

            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Globe className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-xl font-bold">
              Social Media Vault Browser
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Browse websites directly inside your app.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm">

              {[
                'https://example.com',
                'https://www.wikipedia.org',
                'https://www.instagram.com',
                'https://www.tiktok.com',
                'https://www.facebook.com',
                'https://www.youtube.com'
              ].map((site) => (
                <Button
                  key={site}
                  variant="outline"
                  onClick={() => navigate(site)}
                >
                  {new URL(site).hostname.replace('www.', '')}
                </Button>
              ))}

            </div>

          </div>

        ) : (

          <iframe
            ref={iframeRef}
            key={url}
            src={url}
            title="Social Media Vault Browser"
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />

        )}

        {url && loading && (
          <div className="absolute top-3 left-3 right-3 bg-card rounded-lg p-3 shadow text-center text-sm">
            Loading website...
          </div>
        )}

      </div>

      {/* WEBSITE FALLBACK */}

      {url && (
        <div className="p-3 border-t bg-card space-y-2">

          <p className="text-xs text-muted-foreground text-center">
            If the website is blank, it may block embedded browsing.
          </p>

          <Button
            onClick={openExternal}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Website Separately
          </Button>

        </div>
      )}

      {/* DOWNLOAD BUTTON */}

      <Button
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full shadow-xl z-[60]"
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
