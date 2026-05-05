import { motion } from 'motion/react';
import { Monitor, Bot, Layout, Zap, Timer, BarChart3 } from 'lucide-react';

interface FeaturesProps {
  openCheckout?: () => void;
}

export default function Features({ openCheckout }: FeaturesProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="px-6 py-24 max-w-6xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight mb-6 font-display text-white"
        >
          Engineered for <br className="hidden md:block" /><span className="text-[#86868B]">Peak Performance.</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#86868B] max-w-2xl mx-auto font-light"
        >
          Every feature in Momentum is designed to reduce friction and increase your daily output.
        </motion.p>
      </div>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { icon: <Layout />, title: 'Habit Matrix', desc: 'A visual weekly grid tracking non-negotiables with consistency streaks and multi-state tracking (Completed, Skipped, Pending).', color: 'text-blue-400' },
          { icon: <Bot />, title: 'AI Momentum Coach', desc: 'Powered by Gemini 3 Flash. Hyper-personalized coaching that analyzes your habits, tasks, and mental state.', color: 'text-purple-400' },
          { icon: <Zap />, title: 'Momentum Scoring', desc: 'A real-time 0-100 score weighting habits (50%), tasks (30%), and focus (20%) for a single North Star metric.', color: 'text-yellow-400' },
          { icon: <Timer />, title: 'Deep Work Timer', desc: 'Integrated Pomodoro-style timer (25/5/15) that directly contributes to your overall Momentum Score.', color: 'text-rose-400' },
          { icon: <BarChart3 />, title: 'Advanced Analytics', desc: 'Recharts-powered visualizations showing performance trends and identifying your most productive days.', color: 'text-emerald-400' },
          { icon: <Monitor />, title: 'Multi-Mode Layouts', desc: 'Switch between Standard, Focus, Habit-Centric, and Analytics modes to suit your current workflow.', color: 'text-indigo-400' },
        ].map((f, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className="group p-8 rounded-[32px] glass border border-white/10 hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={`w-14 h-14 rounded-2xl glass flex items-center justify-center mb-8 ${f.color} group-hover:scale-110 transition-transform duration-500`}>
              {f.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 font-display tracking-tight text-white">{f.title}</h3>
            <p className="text-[#86868B] leading-relaxed font-light">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
      
      {openCheckout && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <button 
            onClick={openCheckout}
            className="px-12 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white rounded-2xl font-black text-lg tracking-tight hover:scale-105 transition-all shadow-2xl shadow-blue-500/20 font-display uppercase"
          >
            Buy Momentum — $25
          </button>
          <p className="mt-6 text-xs text-[#86868B] font-light">
            One-time purchase. No subscriptions.
          </p>
        </motion.div>
      )}
    </section>
  );
}
