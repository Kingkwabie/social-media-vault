import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  RotateCcw,
  Home,
  Globe,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Browser: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [lastUrl, setLastUrl] = useState('');

  const openWebsite = () => {
    const address = inputUrl.trim();

    if (!address) {
      toast.error('Enter a website or search term.');
      return;
    }

    let formatted = address;

    if (/^https?:\/\//i.test(formatted)) {
      // Keep the supplied website address.
    } else if (formatted.includes('.') && !formatted.includes(' ')) {
      formatted = 'https://' + formatted;
    } else {
      formatted = 'https://www.google.com/search?q=' +
        encodeURIComponent(formatted);
    }

    try {
      const parsed = new URL(formatted);

      if (!['https:', 'http:'].includes(parsed.protocol)) {
        toast.error('Invalid website address.');
        return;
      }

      formatted = parsed.href;
      setLastUrl(formatted);

      const newWindow = window.open(
        formatted,
        '_blank',
        'noopener,noreferrer'
      );

      if (!newWindow) {
        window.location.assign(formatted);
      }

    } catch {
      toast.error('Please enter a valid website address.');
    }
  };

  const goHome = () => {
    setInputUrl('');
    setLastUrl('');
  };

  const openLastWebsite = () => {
    if (!lastUrl) return;

    const newWindow = window.open(
      lastUrl,
      '_blank',
      'noopener,noreferrer'
    );

    if (!newWindow) {
      window.location.assign(lastUrl);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">

      <div className="p-4 border-b bg-card space-y-4">

        <div className="flex gap-2">
          <Input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') openWebsite();
            }}
            placeholder="Enter website or search..."
            className="h-12"
          />

          <Button onClick={openWebsite} className="h-12">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex justify-between items-center">

          <Button
            variant="outline"
            size="sm"
            onClick={goHome}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>

          <div className="flex items-center gap-1 text-xs text-green-500">
            <ShieldCheck className="w-4 h-4" />
            Secure browsing
          </div>

        </div>

      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">

        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <Globe className="w-10 h-10 text-primary" />
        </div>

        <h2 className="text-xl font-bold">
          Social Media Vault Browser
        </h2>

        <p className="text-sm text-muted-foreground mt-3 max-w-sm">
          Visit your favourite websites or search the internet.
          Websites open in a separate browser page.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm">

          {[
            'https://www.google.com',
            'https://www.youtube.com',
            'https://www.instagram.com',
            'https://www.tiktok.com',
            'https://www.facebook.com',
            'https://www.x.com'
          ].map((site) => (
            <Button
              key={site}
              variant="outline"
              onClick={() => {
                setInputUrl(site);
                const newWindow = window.open(
                  site,
                  '_blank',
                  'noopener,noreferrer'
                );

                if (!newWindow) {
                  window.location.assign(site);
                }

                setLastUrl(site);
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {new URL(site).hostname.replace('www.', '').split('.')[0]}
            </Button>
          ))}

        </div>

        {lastUrl && (
          <Button
            onClick={openLastWebsite}
            className="mt-6 w-full max-w-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Open Last Website
          </Button>
        )}

      </div>

    </div>
  );
};

export default Browser;
