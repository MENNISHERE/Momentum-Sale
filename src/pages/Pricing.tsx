import { motion } from 'motion/react';

interface PricingProps {
  openCheckout: () => void;
}

export default function Pricing({ openCheckout }: PricingProps) {
  return (
    <section className="px-6 py-24 min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl w-full glass rounded-[32px] md:rounded-[48px] p-8 md:p-24 text-center mac-shadow-lg border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
          Limited Time Offer
        </div>
        
        <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-8 font-display text-white">
          One price. <br className="hidden md:block" />
          <span className="text-[#86868B]">Infinite momentum.</span>
        </h2>
        
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl md:text-8xl font-black font-display tracking-tighter text-white">$25</span>
            <span className="text-lg md:text-xl text-[#86868B] font-light">/ forever</span>
          </div>
          
          <button 
            onClick={openCheckout}
            className="w-full max-w-sm mx-auto py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white text-sm font-black rounded-full hover:scale-105 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 animate-gradient"
          >
            Start Your Journey
          </button>
          
          <p className="text-xs text-[#86868B] font-light mt-4">
            After payment, you'll be redirected to the tracker. <br />
            Log in with the same email you used to pay.
          </p>

          <p className="text-sm text-[#86868B] font-light">
            No subscriptions. No hidden fees. Just pure productivity.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
