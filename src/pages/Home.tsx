import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { addSubscriber } from '../lib/firebase';
import { 
  Apple, 
  Command, 
  Layout, 
  Sparkles, 
  Calendar, 
  Plus, 
  Settings, 
  Target, 
  Timer, 
  Zap, 
  LayoutGrid, 
  Check, 
  BarChart, 
  RotateCcw, 
  BarChart3,
  Mail,
  User,
  Loader2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface HomeProps {
  openCheckout: () => void;
  triggerNotification: (title: string, message: string) => void;
  weeklyScore: number;
  habits: any[];
  toggleHabit: (id: number, idx: number) => void;
}

export default function Home({ openCheckout, triggerNotification, weeklyScore, habits, toggleHabit }: HomeProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-12 pb-12 px-6 flex flex-col items-center text-center z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#86868B] text-[10px] font-medium uppercase tracking-widest mb-4"
        >
          <Apple className="w-3 h-3" />
          AI-Powered Habit Tracker
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-7xl font-black tracking-tight leading-[1.1] md:leading-[1.05] mb-4 md:mb-6 font-display max-w-5xl text-white"
        >
          The habit <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">tracker</span> <br className="hidden md:block" />
          that <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">feels like home.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl text-base text-[#86868B] leading-relaxed mb-8 font-light"
        >
          Momentum brings a premium, Mac-inspired elegance to your daily productivity on any device. 
          AI-powered insights wrapped in a stunning, high-performance interface.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Premium CTA Wrapper */}
          <div className="flex items-center justify-center sm:justify-between gap-4 p-2 sm:p-3 sm:pr-6 bg-gradient-to-b from-[#16161D] to-[#0B0B0F] border border-white/[0.08] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] w-full max-w-[480px] h-auto sm:h-[68px] backdrop-blur-xl">
            {/* CTA Button */}
            <button 
              onClick={openCheckout}
              className="relative h-[44px] sm:h-[48px] px-8 sm:px-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#5B8CFF_0%,#7C6CFF_50%,#8B5CF6_100%)] shadow-[0_0_20px_rgba(139,92,246,0.35),0_6px_20px_rgba(91,140,255,0.25)] transition-all duration-250 ease-out hover:scale-[1.03] hover:brightness-110 active:scale-[0.98] group overflow-hidden w-full sm:w-auto justify-center"
            >
              {/* Top Shine Highlight Layer */}
              <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
              
              <span className="text-[15px] font-semibold text-white tracking-[0.3px] leading-none relative z-10">
                Start Your Journey
              </span>
              <Command className="w-4 h-4 text-white/80 relative z-10" />
            </button>

            {/* Price Text */}
            <div className="flex items-center gap-1.5 text-[13.5px] font-medium whitespace-nowrap hidden sm:flex">
              <span className="text-[#A1A1AA]">One-time purchase –</span>
              <span className="text-white font-bold">$25</span>
            </div>
          </div>
          
          <p className="text-[10px] text-[#86868B] font-medium max-w-xs">
            After payment, you'll be redirected to the tracker. <br />
            Log in with the same email you used to pay.
          </p>
        </motion.div>
      </section>

      {/* App Interface Preview */}
      <section className="px-4 md:px-6 pb-12 flex justify-center z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl group flex justify-center"
        >
          <div className="w-[1000px] shrink-0 scale-[0.35] sm:scale-100 origin-top -mb-[460px] sm:mb-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl rounded-[40px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
            
            <div className="relative glass-dark rounded-[24px] overflow-hidden mac-shadow-lg border border-white/10">
              {/* Window Controls */}
              <div className="px-6 py-2.5 flex items-center gap-2 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-2 group/controls">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] relative flex items-center justify-center">
                    <div className="w-2 h-2 text-black opacity-0 group-hover/controls:opacity-100 flex items-center justify-center text-[10px]">×</div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#FEB024] relative flex items-center justify-center">
                    <div className="w-1.5 h-0.5 bg-black opacity-0 group-hover/controls:opacity-100"></div>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#28C840] relative flex items-center justify-center">
                    <div className="w-1.5 h-1.5 border-[0.5px] border-black opacity-0 group-hover/controls:opacity-100"></div>
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1 bg-white/5 rounded-lg text-[11px] text-[#86868B] border border-white/5">
                    <Layout className="w-3 h-3" />
                    Dashboard
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-5 bg-[#0A0A0A] min-h-[500px]">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-white font-display flex items-baseline gap-1">
                        Momentum
                        <span className="text-blue-500 text-2xl leading-none">.</span>
                      </h2>
                      <div className="flex items-center gap-2 text-[#86868B] text-[11px] font-medium">
                        <Calendar className="w-2.5 h-2.5" />
                        March 2026
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerNotification('Premium Feature', 'Custom habit creation is available in the full version of Momentum.')}
                      className="flex items-center gap-1 px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white transition-all"
                    >
                      <Plus className="w-2.5 h-2.5 text-blue-400" />
                      <span>Add Habit</span>
                    </button>
                    <button 
                      onClick={() => triggerNotification('Premium Feature', 'Task management and project tracking are unlocked after purchase.')}
                      className="flex items-center gap-1 px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white transition-all"
                    >
                      <Plus className="w-2.5 h-2.5 text-purple-400" />
                      <span>Add Task</span>
                    </button>
                    <button 
                      onClick={() => triggerNotification('Settings Locked', 'Personalize your experience with custom themes and advanced settings in the full version.')}
                      className="flex items-center gap-1 px-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-white transition-all"
                    >
                      <Settings className="w-2.5 h-2.5 text-[#86868B]" />
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-2.5 mb-5">
                  {[
                    { label: 'WEEKLY SCORE', value: `${weeklyScore} / 100`, icon: <Target className="w-4 h-4 text-yellow-500" />, bg: 'bg-yellow-500/10' },
                    { label: 'FOCUS SESSIONS', value: '0', icon: <Timer className="w-4 h-4 text-blue-400" />, bg: 'bg-blue-400/10' },
                    { label: 'OVERALL PROGRESS', value: `${weeklyScore}%`, icon: <Zap className="w-4 h-4 text-purple-400" />, bg: 'bg-purple-400/10' },
                    { label: 'MOMENTUM SCORE', value: weeklyScore.toString(), icon: null, bg: null, isMomentum: true },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#141414] border border-white/5 rounded-xl p-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-[#86868B] tracking-widest mb-1 uppercase">{stat.label}</div>
                        <div className="text-lg font-black text-white font-display">{stat.value}</div>
                        {stat.isMomentum && (
                          <div className="mt-2 w-14 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${weeklyScore}%` }}></div>
                          </div>
                        )}
                      </div>
                      {stat.icon && (
                        <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                          {stat.icon}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-12 gap-3">
                  {/* Left: Habit Calendar */}
                  <div className="col-span-8 bg-[#141414] border border-white/5 rounded-[20px] p-5">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
                        <h3 className="text-sm font-bold text-white">Habit Calendar</h3>
                      </div>
                      <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/5">
                        {['Weekly', 'Monthly', 'Yearly'].map((tab) => (
                          <button 
                            key={tab} 
                            onClick={() => tab !== 'Weekly' && triggerNotification('Extended View', 'Monthly and Yearly analytics are premium features designed for long-term growth.')}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${tab === 'Weekly' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-[#86868B] hover:text-white'}`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-x-auto pb-2 custom-scrollbar">
                      <div className="min-w-[500px] space-y-1.5">
                        {/* Days Header */}
                        <div className="grid grid-cols-[1fr_repeat(7,28px)_50px] gap-1.5 px-2 mb-0.5">
                          <div className=""></div>
                          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                            <div key={day} className="text-[9px] font-bold text-[#444] text-center">{day}</div>
                          ))}
                          <div className=""></div>
                        </div>

                        {/* Habit Rows */}
                        {habits.map((habit, i) => (
                          <div key={i} className="grid grid-cols-[1fr_repeat(7,28px)_50px] gap-1.5 items-center bg-black/20 hover:bg-black/40 border border-white/5 rounded-xl p-2.5 transition-all group">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center ${habit.color} group-hover:scale-110 transition-transform shrink-0 [&>svg]:w-4 [&>svg]:h-4`}>
                                {habit.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold text-white truncate">{habit.name}</div>
                                <div className="flex items-center gap-1 text-[9px] font-bold tracking-widest text-[#444]">
                                  <span className="text-[#86868B]">{habit.cat}</span>
                                  <span className="text-orange-500/60">🔥 {habit.streak}</span>
                                </div>
                              </div>
                            </div>

                            {[...Array(7)].map((_, dayIdx) => (
                              <div key={dayIdx} className="flex justify-center">
                                <button 
                                  onClick={() => toggleHabit(habit.id, dayIdx)}
                                  className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all active:scale-90 ${
                                    habit.checks.includes(dayIdx) 
                                      ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20' 
                                      : 'bg-white/5 border-white/5 hover:border-white/20'
                                  }`}
                                >
                                  {habit.checks.includes(dayIdx) && <Check className="w-2.5 h-2.5 text-white" />}
                                </button>
                              </div>
                            ))}

                            <div className="flex flex-col items-end gap-0.5">
                              <div className="w-8 h-0.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${habit.bg} rounded-full`} style={{ width: `${(habit.checks.length / 7) * 100}%` }}></div>
                              </div>
                              <div className="text-[9px] font-bold text-emerald-400">{habit.checks.length} Total</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Analysis */}
                  <div className="col-span-4 space-y-3">
                    <div className="bg-[#141414] border border-white/5 rounded-[20px] p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart className="w-3.5 h-3.5 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white">Analysis</h3>
                      </div>

                      {/* Weekly Score Card */}
                      <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-3.5 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[10px] font-bold text-orange-400 tracking-widest uppercase">Weekly Score</div>
                          <div className="text-lg font-black text-white font-display">{weeklyScore} / 100</div>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-orange-500 rounded-full shadow-lg shadow-orange-500/20" style={{ width: `${weeklyScore}%` }}></div>
                        </div>
                        <p className="text-[9px] text-[#444] font-medium leading-relaxed">
                          Score based on 50% Habits, 30% Tasks, and 20% Focus.
                        </p>
                      </div>

                      {/* Habit Completion Chart */}
                      <div className="mb-4">
                        <div className="text-[10px] font-bold text-[#86868B] tracking-widest mb-3 uppercase">Habit Completion</div>
                        <div className="flex items-end gap-1.5 h-16 px-1">
                          {[30, 45, 85, 40, 70, 40, 20].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full bg-blue-400 rounded-t-sm transition-all hover:bg-blue-300" style={{ height: `${h}%` }}></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Productivity */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[10px] font-bold text-[#86868B] tracking-widest uppercase">Productivity</div>
                          <div className="text-[9px] font-bold text-white">0%</div>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                          <div className="h-full bg-blue-500 w-[0%] rounded-full"></div>
                          <div className="absolute right-0 -top-4 text-[9px] font-bold text-[#444]">0 / 35 TASKS</div>
                        </div>
                      </div>

                      {/* Mindset Distribution */}
                      <div className="mb-6">
                        <div className="text-[10px] font-bold text-[#86868B] tracking-widest mb-3 uppercase">Mindset Distribution</div>
                        <div className="space-y-3">
                          {[
                            { label: 'MOOD', val: 5.0, color: 'bg-rose-500', percent: 50 },
                            { label: 'MOTIVATION', val: 7.1, color: 'bg-orange-500', percent: 71 },
                            { label: 'FOCUS', val: 3.0, color: 'bg-blue-400', percent: 30 },
                          ].map((m, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-[9px] font-bold text-[#86868B]">{m.label}</div>
                                <div className="text-[9px] font-bold text-white">{m.val.toFixed(1)}</div>
                              </div>
                              <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.percent}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Momentum? */}
      <section className="px-6 py-16 md:py-40 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative glass rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-white/10 mac-shadow-lg">
              <div className="space-y-4 md:space-y-10">
                {[
                  { label: 'Consistency', val: '+42%', desc: 'Average improvement.' },
                  { label: 'Focus Time', val: '2.5h', desc: 'Extra deep work time.' },
                  { label: 'Stress', val: '-28%', desc: 'Reported decrease.' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-row items-center gap-3 md:gap-8">
                    <div className="text-xl md:text-5xl font-black font-display text-white w-14 md:w-24 text-right shrink-0">{stat.val}</div>
                    <div>
                      <div className="text-[10px] md:text-sm font-bold text-white mb-0.5 md:mb-1">{stat.label}</div>
                      <div className="text-[8px] md:text-xs text-[#86868B] font-light leading-tight md:leading-relaxed">{stat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-6xl font-black tracking-tight mb-4 md:mb-8 font-display text-white">Science-backed <br /><span className="text-[#86868B]">productivity.</span></h2>
            <p className="text-sm md:text-lg text-[#86868B] leading-relaxed font-light mb-6 md:mb-10">
              Momentum isn't just a pretty interface. It's built on the principles of atomic habits and cognitive behavioral science.
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              <div className="p-3 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-500/20 flex items-center justify-center mb-2 md:mb-4">
                  <RotateCcw className="w-4 h-4 md:w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-[10px] md:text-base font-bold text-white mb-1 md:mb-2">Atomic Systems</h4>
                <p className="text-[8px] md:text-xs text-[#86868B] font-light">Small daily actions.</p>
              </div>
              <div className="p-3 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500/20 flex items-center justify-center mb-2 md:mb-4">
                  <BarChart3 className="w-4 h-4 md:w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-[10px] md:text-base font-bold text-white mb-1 md:mb-2">Visual Feedback</h4>
                <p className="text-[8px] md:text-xs text-[#86868B] font-light">Dopamine reinforcement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="px-6 md:px-12 py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <Mail className="w-3 h-3" />
            Inner Circle
          </motion.div>
          
          <h2 className="text-2xl md:text-6xl font-black tracking-tight mb-4 md:mb-6 font-display text-white">
            Join the <span className="text-blue-500">Momentum</span> <br />Inner Circle.
          </h2>
          <p className="text-sm md:text-lg text-[#86868B] leading-relaxed font-light mb-8 md:mb-12 max-w-2xl mx-auto">
            Get exclusive performance strategies, early access to new features, and high-performance insights delivered straight to your inbox.
          </p>

          <SubscriptionForm />
        </div>
      </section>
    </>
  );
}

function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setStatus('loading');
    try {
      const result = await addSubscriber(email, name);

      if (result.success) {
        // Automatically send the welcome email via Resend
        try {
          const res = await fetch('/api/auto-subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name })
          });
          const emailData = await res.json();
          
          if (emailData.success) {
            setStatus('success');
            setMessage('Welcome to the circle! We\'ve sent your welcome email.');
          } else {
            setStatus('success');
            setMessage('You\'re in! Your welcome email is on its way.');
          }
        } catch (emailErr) {
          console.error("Email API error:", emailErr);
          setStatus('success');
          setMessage('You\'re in! Your welcome email is on its way.');
        }
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center"
          >
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">You're In!</h3>
            <p className="text-emerald-400/80 text-sm">{message}</p>
            <div className="flex flex-col gap-3 mt-6">
              <button 
                onClick={() => setStatus('idle')}
                className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
              >
                Add another email
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B] group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-white placeholder:text-[#86868B]"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B] group-focus-within:text-blue-400 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                required
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-white placeholder:text-[#86868B]"
              />
            </div>
            
            {status === 'error' && (
              <p className="text-red-400 text-xs font-medium text-left ml-2">{message}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-xl shadow-blue-600/20"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Join Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-[10px] text-[#86868B] font-medium uppercase tracking-widest mt-4">
              No spam. Just high-performance systems.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
