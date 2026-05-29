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
  Instagram, 
  Facebook
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('');

  const handleGo = () => {
    if (!inputUrl) return;
    let formatted = inputUrl;
    if (!formatted.startsWith('http')) {
      formatted = 'https://' + formatted;
    }
    setUrl(formatted);
    toast.info(`Navigating to ${formatted}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Browser Bar */}
      <div className="p-2 border-b border-border bg-card space-y-2">
        <div className="flex gap-2">
          <Input 
            className="h-9 text-xs"
            placeholder="Search or enter URL..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGo()}
          />
          <Button size="sm" onClick={handleGo} className="h-9">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between px-2">
          <div className="flex gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <HomeIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase">
            <ShieldCheck className="w-3 h-3" />
            Secure
          </div>
        </div>
      </div>

      {/* Browser Content Simulated */}
      <div className="flex-1 bg-muted/30 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Globe className="w-10 h-10 text-primary" />
        </div>
        <div className="max-w-xs">
          <h3 className="text-lg font-bold">Safe Browser Mode</h3>
          <p className="text-sm text-muted-foreground">
            Browse freely. When you play a video, a download button will appear below.
          </p>
        </div>
        <Card className="w-full p-4 text-left space-y-3 bg-card border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-pink-500/10 flex items-center justify-center">
               <Instagram className="w-4 h-4 text-pink-500" />
            </div>
            <span className="text-sm font-medium">Instagram.com</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
               <Facebook className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-sm font-medium">Facebook.com</span>
          </div>
        </Card>
      </div>

      {/* Floating Action Button for detection */}
      <Button 
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-[60]"
        onClick={() => toast.success('Searching for media on page...')}
      >
        <Download className="w-6 h-6 animate-bounce" />
      </Button>
    </div>
  );
};

export default Browser;