import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DownloadProvider } from './context/DownloadContext';
import { Toaster } from 'sonner';
import Splash from './pages/Splash';
import Layout from './components/Layout';
import Home from './pages/Home';
import UrlDownloader from './pages/UrlDownloader';
import Browser from './pages/Browser';
import DownloadManager from './pages/DownloadManager';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';
import About from './pages/About';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/url" element={<UrlDownloader />} />
        <Route path="/browser" element={<Browser />} />
        <Route path="/manager" element={<DownloadManager />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DownloadProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <AppContent />
          </div>
          <Toaster position="top-center" />
        </BrowserRouter>
      </DownloadProvider>
    </ThemeProvider>
  );
}

export default App;