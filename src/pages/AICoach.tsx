import { motion } from 'motion/react';
import { Bot, Check, Send } from 'lucide-react';
import { FormEvent, RefObject, useRef, useEffect } from 'react';

import Markdown from 'react-markdown';

interface AICoachProps {
  aiMessages: any[];
  isAiLoading: boolean;
  aiInput: string;
  setAiInput: (val: string) => void;
  handleAiSubmit: (e: FormEvent) => void;
  clearChat: () => void;
  hasApiKey: boolean;
  openCheckout?: () => void;
}

export default function AICoach({ aiMessages, isAiLoading, aiInput, setAiInput, handleAiSubmit, clearChat, hasApiKey, openCheckout }: AICoachProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [aiMessages, isAiLoading]);

  return (
    <section className="px-6 py-24 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {!hasApiKey && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed"
            >
              <p className="font-bold mb-1">⚠️ API Key Missing</p>
              <p>To enable the AI Coach, please add your Gemini API Key in your deployment environment variables (e.g., Netlify Dashboard or local .env). Set the name to <code>VITE_GEMINI_API_KEY</code> or <code>GEMINI_API_KEY</code>.</p>
            </motion.div>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Bot className="w-3 h-3" />
            Meet Your New Mentor
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-8 font-display text-white">
            The AI Coach that <br />
            <span className="text-[#86868B]">actually knows you.</span>
          </h2>
          <p className="text-lg text-[#86868B] leading-relaxed font-light mb-10">
            Kanon's AI doesn't just give generic advice. It analyzes your actual habit data, focus sessions, and productivity patterns to provide hyper-personalized coaching that evolves as you do.
          </p>
          <ul className="space-y-6 mb-12">
            {[
              { title: 'Kanon Scoring', desc: 'Real-time 0-100 score weighting habits (50%), tasks (30%), and focus (20%).' },
              { title: 'Behavioral Tracking', desc: 'Logs your mental state to adjust coaching based on your energy levels.' },
              { title: 'Intelligent Patterns', desc: 'Powered by Gemini 3 Flash to identify why you skip habits and suggest fixes.' }
            ].map((item, i) => (
              <motion.li 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="flex gap-4"
              >
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-[#86868B] font-light">{item.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          {openCheckout && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-start gap-4"
            >
              <button 
                onClick={openCheckout}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-xl font-black text-sm tracking-tight hover:scale-105 transition-all shadow-xl shadow-purple-500/20 font-display uppercase"
              >
                Buy Kanon — $25
              </button>
              <p className="text-[10px] text-[#86868B] font-medium uppercase tracking-widest">
                One-time purchase · Lifetime access
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-[32px] p-6 border border-white/10 mac-shadow-lg relative overflow-hidden h-[500px] md:h-[600px] flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white">Kanon AI Coach</h3>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Analyzing your patterns...
              </div>
            </div>
            <button 
              onClick={clearChat}
              className="text-[10px] font-bold text-[#86868B] hover:text-white uppercase tracking-widest px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
            >
              Clear Chat
            </button>
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto overscroll-contain space-y-4 mb-4 custom-scrollbar pr-2" data-lenis-prevent="true">
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed markdown-body ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 text-[#F5F5F7] border border-white/10 rounded-tl-none'
                }`}>
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#86868B] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#86868B] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#86868B] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAiSubmit} className="relative">
            <input 
              type="text" 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Ask your coach anything..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-12 text-xs text-white placeholder:text-[#444] focus:outline-none focus:border-purple-500/50 transition-all"
            />
            <button 
              type="submit"
              disabled={isAiLoading || !aiInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 via-purple-700 to-purple-500 flex items-center justify-center text-white hover:scale-110 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20 animate-gradient"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
