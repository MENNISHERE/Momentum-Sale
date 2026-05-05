import React from 'react';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  triggerNotification: (title: string, message: string) => void;
}

export default function Footer({ triggerNotification }: FooterProps) {
  return (
    <footer className="px-6 md:px-12 py-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="flex items-center gap-3 font-black text-xl tracking-tighter font-display text-white">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 relative overflow-hidden">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <div 
                className="absolute left-0 w-2.5 h-4 bg-white/20"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 75%, 0 25%)' }}
              />
              <div 
                className="absolute right-0 w-2.5 h-3.5 bg-white/60 -translate-y-0.5"
                style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
              />
            </div>
          </div>
          <span className="uppercase tracking-widest text-lg flex items-baseline gap-1">
            Momentum
            <span className="text-blue-500 text-2xl leading-none">.</span>
          </span>
        </Link>
      </div>
      
      <div className="flex gap-10 text-sm font-medium text-[#86868B]">
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
        <Link to="/support" className="hover:text-white transition-colors">Support</Link>
        <a href="/assets/logo.svg" download="momentum_logo.svg" className="hover:text-white transition-colors">Assets</a>
      </div>

      <div className="text-[11px] text-[#86868B] font-medium uppercase tracking-widest">
        © 2026 Momentum Inc.
      </div>
    </footer>
  );
}
