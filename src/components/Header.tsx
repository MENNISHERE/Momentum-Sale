import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  openCheckout: () => void;
}

export default function Header({ openCheckout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Features', path: '/features' },
    { name: 'AI Coach', path: '/ai-coach' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-6 py-3 md:py-4 flex justify-center">
      <div className="max-w-6xl w-full glass rounded-2xl px-4 md:px-6 py-2 md:py-3 flex items-center justify-between border border-white/10 mac-shadow-sm relative">
        <Link to="/" className="flex items-center gap-2.5 group z-50">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-xl shadow-indigo-500/30 relative overflow-hidden"
          >
            {/* Unique "Kanon Hex" Mark */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              {/* Left Half Hex */}
              <div 
                className="absolute left-0 w-3 h-5 bg-white/40"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 75%, 0 25%)' }}
              />
              {/* Right Half Hex (Shifted Up) */}
              <div 
                className="absolute right-0 w-3 h-5 bg-white -translate-y-1 shadow-lg"
                style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
          </motion.div>
          <span className="text-base md:text-lg font-black tracking-tight text-white font-display uppercase tracking-widest flex items-baseline gap-1">
            Kanon
            <span className="text-blue-500 text-2xl md:text-3xl leading-none select-none">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="relative text-[10px] font-bold text-[#86868B] hover:text-white transition-colors uppercase tracking-widest group py-1"
            >
              {item.name}
              <motion.div 
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-500 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 z-50">
          <a 
            href={`${typeof window !== 'undefined' ? window.location.origin : ''}/login`}
            className="hidden lg:block text-[9px] font-bold text-[#86868B] hover:text-white transition-colors uppercase tracking-widest mr-2"
          >
            Already purchased? Log in
          </a>
          <button 
            onClick={openCheckout}
            className="px-4 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white text-[9px] md:text-[10px] font-bold rounded-full hover:scale-105 transition-all uppercase tracking-widest shadow-lg shadow-blue-500/20 animate-gradient"
          >
            Get Started
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-[#86868B] hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 mt-2 p-4 glass rounded-2xl border border-white/10 md:hidden flex flex-col gap-4 z-40"
            >
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs font-bold text-[#86868B] hover:text-white transition-colors uppercase tracking-widest py-2 border-b border-white/5 last:border-0"
                >
                  {item.name}
                </Link>
              ))}
              <a 
                href={`${typeof window !== 'undefined' ? window.location.origin : ''}/login`}
                onClick={() => setIsMenuOpen(false)}
                className="text-xs font-bold text-[#86868B] hover:text-white transition-colors uppercase tracking-widest py-2"
              >
                Already purchased? Log in
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
