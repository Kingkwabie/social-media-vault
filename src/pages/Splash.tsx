import React from 'react';
import { motion } from 'framer-motion';

const Splash: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl p-4 shadow-2xl flex items-center justify-center overflow-hidden">
           <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/9885ba7c-7211-4a09-9613-469cb82a5453/app-logo-8562318b-1780079907380.webp" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          VideoDownloader <span className="text-indigo-400">Pro</span>
        </h1>
        <p className="mt-2 text-indigo-200/80 font-medium">All-in-One Downloader</p>
      </motion.div>

      {/* Background Animated Circles */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]"
      />
      
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2 }}
            className="h-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"
          />
        </div>
        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Initializing...</p>
      </div>
    </div>
  );
};

export default Splash;