import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Link as LinkIcon, 
  Globe, 
  Download, 
  Image as GalleryIcon,
  Settings as SettingsIcon,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Layout: React.FC = () => {
  const location = useLocation();
  const showBackButton = !['/', '/url', '/browser', '/manager', '/gallery'].includes(location.pathname);

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/url', icon: LinkIcon, label: 'URL' },
    { path: '/browser', icon: Globe, label: 'Browse' },
    { path: '/manager', icon: Download, label: 'Queue' },
    { path: '/gallery', icon: GalleryIcon, label: 'Gallery' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background relative overflow-hidden shadow-2xl">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            VideoDownloader Pro
          </h1>
        </div>
        <NavLink to="/settings">
          <Button variant="ghost" size="icon">
            <SettingsIcon className="w-5 h-5" />
          </Button>
        </NavLink>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border px-2 py-2 flex justify-around items-center z-50 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;