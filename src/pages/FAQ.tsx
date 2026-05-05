import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface FAQProps {
  openCheckout?: () => void;
}

export default function FAQ({ openCheckout }: FAQProps) {
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
        {[
          { q: 'Is it really a one-time payment?', a: 'Yes. We believe in tools, not subscriptions. You pay once and own the current version of Momentum forever, including all minor updates.' },
          { q: 'Does it work on Windows and Android?', a: 'Absolutely. While the design is inspired by macOS, Momentum is a high-performance web application that works perfectly on any modern browser and device.' },
          { q: 'How secure is my data?', a: 'Your privacy is our priority. All habit data is encrypted, and we never sell your personal information to third parties.' },
          { q: 'Can I export my data?', a: 'Yes, you can export your entire habit history and task data as a CSV or JSON file at any time from the settings menu.' }
        ].map((item, i) => (
          <details key={i} className="group glass border border-white/10 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <span className="text-lg font-bold text-white">{item.q}</span>
              <Plus className="w-5 h-5 text-[#86868B] group-open:rotate-45 transition-transform" />
            </summary>
            <div className="px-6 pb-6 text-[#86868B] font-light leading-relaxed">
              {item.a}
            </div>
          </details>
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
            Buy Momentum — $25
          </button>
          <p className="mt-4 text-[10px] text-[#86868B] font-medium uppercase tracking-widest">
            One-time purchase · Lifetime access
          </p>
        </motion.div>
      )}
    </section>
  );
}
