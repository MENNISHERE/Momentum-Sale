import React from 'react';
import { motion } from 'motion/react';
import { 
  CreditCard, 
  Mail, 
  Key, 
  ShieldCheck, 
  LayoutGrid, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Apple,
  ChevronRight
} from 'lucide-react';

export default function Onboarding() {
  const steps = [
    {
      id: 1,
      title: "Secure Your Spot",
      desc: "Click 'Start Your Journey' or 'Get Started' and complete the one-time payment via Whop's secure checkout.",
      icon: <CreditCard className="w-6 h-6 text-blue-400" />,
      detail: "You'll receive an instant confirmation email once the transaction is verified."
    },
    {
      id: 2,
      title: "Initialize Identity",
      desc: "Go to the login page and enter the exact same email address you used for the payment.",
      icon: <Mail className="w-6 h-6 text-purple-400" />,
      detail: "Consistency starts with your credentials. Using a different email will result in access denial."
    },
    {
      id: 3,
      title: "Verification Protocol",
      desc: "Open your Gmail or email app. Look for a message from 'Kanon' containing your unique verification code.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      detail: "Check your spam or promotions folder if you don't see it within 60 seconds."
    },
    {
      id: 4,
      title: "Authenticate",
      desc: "Return to the Kanon login screen and enter the 6-digit code to unlock your high-performance environment.",
      icon: <Key className="w-6 h-6 text-orange-400" />,
      detail: "Your session is now secured and your data is ready to be initialized."
    },
    {
      id: 5,
      title: "Configure Your Matrix",
      desc: "Add your first 5 'Non-Negotiable' habits. These are the foundation of your daily kanon.",
      icon: <LayoutGrid className="w-6 h-6 text-indigo-400" />,
      detail: "We recommend starting with simple wins: Hydration, Movement, and Deep Work."
    },
    {
      id: 6,
      title: "Set Daily Targets",
      desc: "Populate your Task Engine with the 3 most important objectives for today.",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      detail: "Focus on impact, not just activity. The Task Engine tracks your real-time progress."
    },
    {
      id: 7,
      title: "Build Kanon",
      desc: "Complete your first check-in. Watch your Kanon Score climb as you stack wins.",
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      detail: "Consistency is the only metric that matters. Welcome to the elite 1%."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#86868B] text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <Apple className="w-3 h-3" />
            Access Protocol
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 font-display"
          >
            How to Access <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Your Kanon.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#86868B] text-lg max-w-2xl mx-auto font-light"
          >
            Follow this step-by-step guide to initialize your high-performance environment and start tracking your growth.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative glass-dark rounded-[32px] p-8 border border-white/10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Icon only (no number) */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    {step.title}
                    <ChevronRight className="w-4 h-4 text-white/20" />
                  </h3>
                  <p className="text-[#86868B] leading-relaxed mb-4">
                    {step.desc}
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] font-medium text-blue-400/80 italic">{step.detail}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 rounded-[48px] bg-gradient-to-b from-blue-600 to-indigo-700 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-6 font-display">Ready to begin?</h2>
            <p className="text-white/80 mb-10 max-w-md mx-auto font-medium">
              Your high-performance journey starts with the first step. Don't let another day slip by.
            </p>
            <a 
              href="/pricing"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              Initialize Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Support Link */}
        <div className="mt-12 text-center">
          <p className="text-[#86868B] text-sm">
            Having trouble? <a href="/support" className="text-blue-400 font-bold hover:underline">Contact Performance Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
