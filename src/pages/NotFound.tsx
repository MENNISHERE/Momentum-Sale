import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Zap } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#050505]">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[160px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block mb-12"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 flex items-center justify-center mac-shadow-lg">
            <Compass className="w-10 h-10 md:w-14 md:h-14 text-white/80" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">
            Lost in <span className="text-indigo-500">Space</span>
          </h1>
          <p className="text-[#86868B] text-lg md:text-xl font-medium tracking-tight mb-12 max-w-lg mx-auto leading-relaxed">
            The path you followed lead to a void. Let's redirect your kanon back to where it matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/"
              className="group relative px-8 py-4 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <div className="relative z-10 flex items-center gap-3">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Return Home
              </div>
            </Link>
            
            <Link 
              to="/support"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all hover:border-white/20 active:scale-95"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>

        {/* Status indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex items-center justify-center gap-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.3em]">Error Code: 404 / Missing Path</span>
        </motion.div>
      </div>

      {/* Decorative Brand Accent */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-white/10" />
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[1em] flex items-baseline translate-x-[0.5em]">
            Kanon
            <span className="text-blue-500 text-lg ml-1">.</span>
          </span>
          <div className="h-[1px] w-12 bg-white/10" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
