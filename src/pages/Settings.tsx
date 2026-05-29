import React from 'react';
import { 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Bell, 
  Smartphone, 
  Info,
  Crown,
  ChevronRight,
  Trash2,
  FileBarChart
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useDownloads } from '@/context/DownloadContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { clearHistory } = useDownloads();
  const navigate = useNavigate();

  const sections = [
    {
      title: 'General',
      items: [
        { 
          icon: theme === 'dark' ? Moon : Sun, 
          label: 'Dark Mode', 
          action: <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />,
          color: 'text-indigo-500 bg-indigo-500/10'
        },
        { 
          icon: Globe, 
          label: 'Language', 
          value: 'English', 
          color: 'text-blue-500 bg-blue-500/10' 
        },
        { 
          icon: Bell, 
          label: 'Notifications', 
          action: <Switch checked={true} />, 
          color: 'text-orange-500 bg-orange-500/10' 
        },
      ]
    },
    {
      title: 'Download Settings',
      items: [
        { 
          icon: Smartphone, 
          label: 'Download Path', 
          value: 'Internal Storage', 
          color: 'text-green-500 bg-green-500/10' 
        },
        { 
          icon: FileBarChart, 
          label: 'Statistics', 
          onClick: () => {}, 
          color: 'text-purple-500 bg-purple-500/10' 
        },
        { 
          icon: Trash2, 
          label: 'Clear History', 
          onClick: clearHistory, 
          color: 'text-red-500 bg-red-500/10',
          textColor: 'text-red-500'
        },
      ]
    },
    {
      title: 'About',
      items: [
        { 
          icon: Shield, 
          label: 'Privacy Policy', 
          onClick: () => navigate('/about'), 
          color: 'text-slate-500 bg-slate-500/10' 
        },
        { 
          icon: Info, 
          label: 'About App', 
          onClick: () => navigate('/about'), 
          color: 'text-slate-500 bg-slate-500/10' 
        },
      ]
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Premium Banner */}
      <Card className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-none text-white shadow-lg overflow-hidden relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -right-4 -top-4 opacity-10"
        >
          <Crown className="w-24 h-24" />
        </motion.div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Go Premium</h3>
            <p className="text-xs text-indigo-100">No Ads, Faster Downloads, Unlimited Content</p>
          </div>
          <Button variant="secondary" size="sm" className="font-bold">Upgrade</Button>
        </div>
      </Card>

      {sections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{section.title}</h2>
          <Card className="divide-y border-none shadow-sm overflow-hidden bg-card">
            {section.items.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={item.onClick}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${item.textColor || ''}`}>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-xs text-muted-foreground">{item.value}</span>}
                  {item.action ? item.action : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </Card>
        </div>
      ))}

      <div className="text-center pt-4 pb-8">
        <p className="text-[10px] text-muted-foreground font-medium">VideoDownloader Pro v2.4.0</p>
        <p className="text-[10px] text-muted-foreground italic mt-1">Developed with ❤️ for the community</p>
      </div>
    </div>
  );
};

export default Settings;