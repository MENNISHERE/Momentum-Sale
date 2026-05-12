import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

interface FAQProps {
  openCheckout?: () => void;
}

const faqs = [
  { q: 'Is it really a one-time payment?', a: 'Yes. We believe in tools, not subscriptions. You pay once and own the current version of Kanon forever, including all minor updates.' },
  { q: 'Does it work on Windows and Android?', a: 'Absolutely. While the design is inspired by macOS, Kanon is a high-performance web application that works perfectly on any modern browser and device.' },
  { q: 'How secure is my data?', a: 'Your privacy is our priority. All habit data is encrypted, and we never sell your personal information to third parties.' },
  { q: 'Can I export my data?', a: 'Yes, you can export your entire habit history and task data as a CSV or JSON file at any time from the settings menu.' }
];

export default function FAQ({ openCheckout }: FAQProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-24 max-w-4xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 font-display text-white">Common <br /><span className="text-[#86868B]">Questions.</span></h2>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {faqs.map((item, i) => (
          <div key={i} className="glass border border-white/10 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 cursor-pointer text-left transition-colors hover:bg-white/[0.02]"
            >
              <span className="text-lg font-bold text-white">{item.q}</span>
              <motion.div
                animate={{ rotate: activeIndex === i ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Plus className="w-5 h-5 text-[#86868B]" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {activeIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-[#86868B] font-light leading-relaxed">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
      
      {openCheckout && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <button 
            onClick={openCheckout}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white rounded-xl font-black text-sm tracking-tight hover:scale-105 transition-all shadow-xl shadow-blue-500/20 font-display uppercase"
          >
            Buy Kanon — $25
          </button>
          <p className="mt-4 text-[10px] text-[#86868B] font-medium uppercase tracking-widest">
            One-time purchase · Lifetime access
          </p>
        </motion.div>
      )}
    </section>
  );
}
