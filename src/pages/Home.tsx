import React from 'react';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Music, 
  Ghost, 
  Share2, 
  Clock,
  TrendingUp,
  Download,
  Flame
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDownloads } from '@/context/DownloadContext';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useDownloads();

  const platforms = [
    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]' },
    { name: 'Facebook', icon: Facebook, color: 'bg-[#1877F2]' },
    { name: 'TikTok', icon: Music, color: 'bg-[#000000]' },
    { name: 'X / Twitter', icon: Twitter, color: 'bg-[#1DA1F2]' },
    { name: 'Youtube', icon: Youtube, color: 'bg-[#FF0000]' },
    { name: 'Snapchat', icon: Ghost, color: 'bg-[#FFFC00] text-black' },
    { name: 'Threads', icon: Share2, color: 'bg-black' },
    { name: 'Pinterest', icon: Flame, color: 'bg-[#E60023]' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Stats Section */}
      <section className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-primary/5 border-primary/10 flex flex-col items-center text-center">
          <Download className="w-5 h-5 text-primary mb-2" />
          <span className="text-2xl font-bold">{stats.totalDownloaded}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Downloads</span>
        </Card>
        <Card className="p-4 bg-purple-500/5 border-purple-500/10 flex flex-col items-center text-center">
          <Clock className="w-5 h-5 text-purple-500 mb-2" />
          <span className="text-2xl font-bold">{stats.totalSize}</span>
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Total Size</span>
        </Card>
      </section>

      {/* Platforms Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Supported Platforms</h2>
          <Button variant="link" size="sm" className="text-xs h-auto p-0">View All</Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <motion.button
                key={platform.name}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/url')}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${platform.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-semibold truncate w-full text-center">{platform.name}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Ad Placeholder */}
      <Card className="bg-muted p-3 border-dashed border-2 flex items-center justify-center h-24">
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase">Advertisement</p>
          <p className="text-xs font-medium italic">Support us by viewing this ad</p>
        </div>
      </Card>

      {/* Quick Actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</h2>
        <Card 
          className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => navigate('/url')}
        >
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold">Auto-detect Link</h3>
            <p className="text-xs text-muted-foreground">Paste from clipboard instantly</p>
          </div>
        </Card>
      </section>

      {/* Recent Activity */}
      <section className="pb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Trending Creators</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex-shrink-0 w-20 flex flex-col items-center gap-1">
              <div className="w-16 h-16 rounded-full border-2 border-primary p-0.5">
                <img 
                  src={`https://i.pravatar.cc/150?u=${i}`} 
                  className="w-full h-full rounded-full object-cover"
                  alt="Avatar"
                />
              </div>
              <span className="text-[10px] font-medium text-center">User_{i}99</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;