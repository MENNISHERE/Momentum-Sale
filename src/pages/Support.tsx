import { motion } from 'motion/react';
import { Mail, MessageSquare, Globe, ArrowRight } from 'lucide-react';

interface SupportProps {
  openCheckout?: () => void;
}

export default function Support({ openCheckout }: SupportProps) {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 font-display">
            How can we <span className="text-blue-500">help?</span>
          </h1>
          <p className="text-xl text-[#86868B] font-light max-w-2xl mx-auto">
            Whether you're stuck on a setup or have a feature request, our team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { 
              icon: <Mail className="w-6 h-6 text-blue-400" />, 
              title: 'Email Support', 
              desc: 'Get a response within 24 hours.',
              action: 'support@kanon.com',
              link: 'mailto:support@kanon.com'
            },
            { 
              icon: <MessageSquare className="w-6 h-6 text-purple-400" />, 
              title: 'Community', 
              desc: 'Join our Discord for instant help.',
              action: 'Join Discord',
              link: 'https://discord.gg/kanon'
            },
            { 
              icon: <Globe className="w-6 h-6 text-emerald-400" />, 
              title: 'Knowledge Base', 
              desc: 'Read our detailed documentation.',
              action: 'View Docs',
              link: '/faq'
            }
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-[#86868B] font-light mb-6">{item.desc}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                {item.action}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="glass rounded-[40px] p-10 border border-white/10 mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Send a direct message</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest mb-2 block">Your Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-blue-500/50 outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest mb-2 block">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-blue-500/50 outline-none" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest mb-2 block">Message</label>
              <textarea className="w-full h-[156px] bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-blue-500/50 outline-none resize-none" placeholder="How can we help?"></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="px-10 py-4 bg-white text-black font-black rounded-full hover:bg-[#F5F5F7] transition-all uppercase tracking-widest text-xs">
                Send Message
              </button>
            </div>
          </form>
        </div>

        {openCheckout && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
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
      </div>
    </div>
  );
}
