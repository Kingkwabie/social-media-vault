import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const About: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-8">
         <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-3xl p-4 flex items-center justify-center">
           <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/9885ba7c-7211-4a09-9613-469cb82a5453/app-logo-8562318b-1780079907380.webp" 
            alt="Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold">VideoDownloader Pro</h1>
        <p className="text-xs text-muted-foreground mt-1">Professional Social Media Suite</p>
      </div>

      <Card className="p-4 bg-muted/30 border-none space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider">Our Mission</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We provide a seamless and high-speed experience for users to save their favorite social media content across all platforms. Our app is built with privacy and speed in mind.
        </p>
      </Card>

      <div className="space-y-3">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Legal & Support</h2>
        <Card className="divide-y border-none shadow-sm overflow-hidden bg-card">
          {[
            { icon: ShieldCheck, label: 'Privacy Policy', color: 'text-green-500' },
            { icon: FileText, label: 'Terms of Service', color: 'text-blue-500' },
            { icon: HelpCircle, label: 'Help Center', color: 'text-orange-500' },
            { icon: Mail, label: 'Contact Support', color: 'text-purple-500' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </Card>
      </div>

      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by the Pro Team
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="w-8 h-8 opacity-50"><ExternalLink className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 opacity-50"><ExternalLink className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
};

export default About;