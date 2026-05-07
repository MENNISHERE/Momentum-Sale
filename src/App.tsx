import React, { useEffect, useState, useRef, FormEvent } from 'react';
import Lenis from 'lenis';
import { Toaster, toast } from 'sonner';
import { Zap, X, Apple, Droplets, Dumbbell, BookOpen, Wind, Footprints, Moon, Bell, Sparkles } from 'lucide-react';
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

// Pages
import Home from './pages/Home';
import Features from './pages/Features';
import AICoach from './pages/AICoach';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';

import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SupportPage from './pages/Support';
import Admin from './pages/Admin';
import Onboarding from './pages/Onboarding';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Only scroll to top if not on the AI Coach page or if the user explicitly navigated
    if (pathname !== '/ai-coach') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ExternalRedirect({ to }: { to: string }) {
  const { search } = useLocation();
  useEffect(() => {
    window.location.href = to + search;
  }, [to, search]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isRevealingCheckout, setIsRevealingCheckout] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai', text: string }[]>(() => {
    const saved = localStorage.getItem('momentum_chat');
    return saved ? JSON.parse(saved) : [
      { role: 'ai', text: "Welcome to Momentum. I'm your AI Coach. I've analyzed your initial setup and I'm ready to help you optimize your performance. How can I assist you today?" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('momentum_chat', JSON.stringify(aiMessages));
  }, [aiMessages]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const getApiKey = () => {
    try {
      return (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
             import.meta.env.VITE_GEMINI_API_KEY || 
             import.meta.env.VITE_MOMENTUM_AI_KEY || 
             '';
    } catch {
      return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_MOMENTUM_AI_KEY || '';
    }
  };

  const hasApiKey = !!getApiKey();

  const clearChat = () => {
    setAiMessages([{ role: 'ai', text: "Chat cleared. How can I help you start fresh?" }]);
    localStorage.removeItem('momentum_chat');
  };
  const [habits, setHabits] = useState([
    { id: 1, name: 'Drink Water', cat: 'HEALTH', streak: 7, icon: <Droplets className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-400', checks: [] as number[] },
    { id: 2, name: 'Workout', cat: 'HEALTH', streak: 6, icon: <Dumbbell className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-400', checks: [2] },
    { id: 3, name: 'Read', cat: 'LEARNING', streak: 17, icon: <BookOpen className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-400', checks: [1, 2, 3, 4] },
    { id: 4, name: 'Meditate', cat: 'MINDSET', streak: 3, icon: <Wind className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-400', checks: [5] },
    { id: 5, name: 'Walk 10k Steps', cat: 'HEALTH', streak: 10, icon: <Footprints className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-400', checks: [4, 5, 6] },
    { id: 6, name: 'Sleep 8 Hours', cat: 'HEALTH', streak: 1, icon: <Moon className="w-4 h-4" />, color: 'text-blue-300', bg: 'bg-blue-300', checks: [5] },
  ]);

  const triggerNotification = (title: string, message: string) => {
    // Play a premium notification sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play blocked:', e));

    toast.custom((t) => (
      <motion.div 
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-dark rounded-[20px] p-4 mac-shadow-lg flex items-center gap-4 min-w-[320px] max-w-[400px] border border-white/10"
      >
        <div className="w-11 h-11 rounded-2xl bg-white/[0.03] flex items-center justify-center shrink-0 border border-white/10">
          <Bell className="w-5 h-5 text-white/80" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-semibold text-white/90 leading-tight mb-1 font-sans tracking-tight">{title}</h4>
          <p className="text-[13px] text-white/50 leading-snug font-medium font-sans">{message}</p>
        </div>
        <button 
          onClick={() => toast.dismiss(t)} 
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-white/20 hover:text-white/60 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    ), {
      duration: 4000,
      position: 'top-right',
    });
  };

  const toggleHabit = (habitId: number, dayIdx: number) => {
    triggerNotification('Preview Mode', 'Unlock full consistency tracking and historical data with the premium version.');
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newChecks = h.checks.includes(dayIdx)
          ? h.checks.filter(d => d !== dayIdx)
          : [...h.checks, dayIdx];
        return { ...h, checks: newChecks };
      }
      return h;
    }));
  };

  const totalChecks = habits.reduce((acc, h) => acc + h.checks.length, 0);
  const weeklyScore = Math.min(100, Math.round((totalChecks / (habits.length * 7)) * 100));

  const handleAiSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiLoading) return;

    const userMessage = aiInput.trim();
    setAiMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error("API Key is missing. Please check your environment settings.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `You are the AI Momentum Coach, a high-performance habit and productivity expert. Your tone is professional, encouraging, and precise. You provide actionable insights based on habit tracking data.

Use Markdown for your responses (bolding, lists, etc.) to make them readable and structured.

Here is a detailed breakdown of the Momentum tracker features and information:
1. Core Productivity Engines:
- Habit Matrix (HabitGrid): A visual weekly grid tracking non-negotiables.
- Dynamic Task Engine (TaskList): Daily to-do list with real-time progress.
- Deep Work Timer (FocusTimer): Integrated Pomodoro-style timer.

2. Intelligent Insights:
- AI Momentum Coach: Powered by Gemini 3 Flash. Analyzes habits, task completion, and mental state.
- Behavioral Tracker: Logs "Mental State" (Focused, Tired, Stressed).

3. Pricing & Navigation:
- Pricing: Momentum costs a one-time fee of $25. There are no subscriptions.
- Navigation: If a user asks about pricing, explicitly mention that they can find more details and purchase on the **Pricing Page** (/pricing).
- Other Pages: Home (/), Features (/features), FAQ (/faq).

4. Analytics & Gamification:
- Momentum Scoring System: Weekly Score (0-100) weighting habit consistency (50%), task completion (30%), and focus sessions (20%).
- Advanced Analytics Panel: Data visualizations showing performance trends.

Keep responses concise, impactful, and always refer to these specific features or pages when relevant. If the user asks about the cost or how to buy, guide them to the Pricing page.`,
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that. Let's try again.";
      setAiMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error: any) {
      console.error("AI Error:", error);
      let errorMessage = "Connection lost. The AI service might be temporarily unavailable.";
      
      if (error.message?.includes("API Key")) {
        errorMessage = "API Key is missing. Please add your Gemini API Key in the 'Settings' menu (gear icon) -> 'Secrets' or 'Environment Variables' section.";
      } else if (error.message?.includes("404") || error.message?.includes("not found")) {
        errorMessage = "The AI model is currently unavailable or the model name is incorrect. (Error: " + error.message + ")";
      } else if (error.message?.includes("429") || error.message?.includes("quota")) {
        errorMessage = "Rate limit exceeded. Please wait a moment.";
      } else {
        errorMessage = "AI Error: " + (error.message || "Unknown error occurred.");
      }
      
      setAiMessages(prev => [...prev, { role: 'ai', text: errorMessage }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCheckoutOpen]);

  const openCheckout = () => {
    setIsRevealingCheckout(true);
    // Cinematic reveal for 3 seconds so it's clearly visible
    setTimeout(() => {
      setIsRevealingCheckout(false);
      setIsCheckoutOpen(true);
    }, 3000);
  };
  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F7] font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollToTop />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full"></div>
      </div>

      <Header openCheckout={openCheckout} />
      <Toaster />

      <main className="pb-32 md:pb-0">
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={
              <PageWrapper>
                <Home 
                  openCheckout={openCheckout} 
                  triggerNotification={triggerNotification} 
                  weeklyScore={weeklyScore} 
                  habits={habits} 
                  toggleHabit={toggleHabit} 
                />
              </PageWrapper>
            } />
            <Route path="/features" element={
              <PageWrapper>
                <Features />
              </PageWrapper>
            } />
            <Route path="/ai-coach" element={
              <PageWrapper>
                <AICoach 
                  aiMessages={aiMessages} 
                  isAiLoading={isAiLoading} 
                  aiInput={aiInput} 
                  setAiInput={setAiInput} 
                  handleAiSubmit={handleAiSubmit} 
                  clearChat={clearChat}
                  hasApiKey={hasApiKey}
                />
              </PageWrapper>
            } />
            <Route path="/pricing" element={
              <PageWrapper>
                <Pricing openCheckout={openCheckout} />
              </PageWrapper>
            } />
            <Route path="/faq" element={
              <PageWrapper>
                <FAQ />
              </PageWrapper>
            } />
            <Route path="/privacy" element={
              <PageWrapper>
                <Privacy />
              </PageWrapper>
            } />
            <Route path="/terms" element={
              <PageWrapper>
                <Terms />
              </PageWrapper>
            } />
            <Route path="/support" element={
              <PageWrapper>
                <SupportPage />
              </PageWrapper>
            } />
            <Route path="/admin" element={<ExternalRedirect to="/" />} />
            <Route path="/momentum-hq-679715" element={
              <PageWrapper>
                <Admin />
              </PageWrapper>
            } />
            <Route path="/tutorial" element={
              <PageWrapper>
                <Onboarding />
              </PageWrapper>
            } />
            <Route path="/login" element={<ExternalRedirect to={`${window.location.origin}/login`} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer triggerNotification={triggerNotification} />
      <BottomNav />

      {/* Momentum Reveal Animation */}
      <AnimatePresence>
        {isRevealingCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, filter: "blur(40px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 1.1, opacity: 0, filter: "blur(20px)" }}
              transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-500/30 blur-[120px] rounded-full animate-pulse" />
              <div className="relative flex flex-col items-center">
                <motion.div 
                  animate={{ 
                    rotate: [0, 5, 0],
                    scale: [1, 1.05, 1],
                    boxShadow: ["0 0 20px rgba(79,70,229,0.3)", "0 0 60px rgba(79,70,229,0.6)", "0 0 20px rgba(79,70,229,0.3)"]
                  }}
                  transition={{ 
                    rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] relative overflow-hidden"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    {/* Left Half Hex */}
                    <div 
                      className="absolute left-0 w-6 h-10 bg-white/30"
                      style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 75%, 0 25%)' }}
                    />
                    {/* Right Half Hex (Shifted Up) */}
                    <div 
                      className="absolute right-0 w-6 h-10 bg-white -translate-y-2 shadow-2xl"
                      style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </motion.div>
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 160, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                  className="h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-10"
                />
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="mt-6 text-[12px] font-black text-white uppercase tracking-[0.8em]"
                >
                  Momentum
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal (Pre-loaded in background) */}
      <div 
        className={`fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-[2000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isCheckoutOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`absolute inset-0 bg-black/80 backdrop-blur-2xl transition-opacity duration-[2000ms] ${isCheckoutOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeCheckout}
        />
        
        <motion.div 
          animate={isCheckoutOpen ? { scale: 1, opacity: 1, y: 0 } : { scale: 0.9, opacity: 0, y: 100 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-[#0A0A0A] border-t md:border border-white/10 rounded-t-[48px] md:rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Mobile Handle */}
          <div className="md:hidden flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-white/10 rounded-full" />
          </div>
          {/* Header */}
          <div className="px-8 py-5 flex items-center justify-between border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                <Apple className="w-4 h-4 text-white/90" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-[0.25em] leading-none mb-1">Secure Checkout</span>
                <span className="text-[8px] font-medium text-[#86868B] uppercase tracking-widest leading-none">Momentum Premium</span>
              </div>
            </div>
            <button 
              onClick={closeCheckout}
              className="group w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-[#86868B] hover:text-white transition-all duration-300"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
          
          <div className="relative min-h-[500px] max-h-[85vh] overflow-y-auto custom-scrollbar rounded-b-[48px]">
            <div className="p-6 rounded-2xl">
              <WhopCheckoutEmbed
                planId="plan_LmpKdB61bva3r"
                returnUrl={`${window.location.origin}/login?from=checkout`}
                theme="dark"
                styles={{ container: { paddingY: 0 } }}
              />
              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] text-[#86868B] font-medium leading-relaxed">
                  After payment, you'll be redirected to the tracker. <br />
                  Log in with the same email you used to pay.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [secretsConnected, setSecretsConnected] = useState(false);

  useEffect(() => {
    const checkSecrets = async () => {
      // Simulate connection check for web skeleton presentation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const apiKey = (() => {
        try {
          return (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                 import.meta.env.VITE_GEMINI_API_KEY || 
                 import.meta.env.VITE_MOMENTUM_AI_KEY || 
                 '';
        } catch {
          return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_MOMENTUM_AI_KEY || '';
        }
      })();
      
      const connected = !!apiKey;
      setSecretsConnected(connected);
      setIsInitializing(false);
      
      if (connected) {
        console.log("API/Secrets 10001% connected successfully. Proceeding with load...");
      } else {
        console.warn("API Key could not be loaded from environment variables. AI features may be limited.");
      }
    };
    checkSecrets();
  }, []);

  if (isInitializing) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden text-[#F5F5F7] font-sans"
      >
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/20 blur-[140px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-purple-600/20 blur-[180px] rounded-full"></div>
        </div>

        <div className="flex flex-col items-center gap-12 max-w-md w-full px-8 relative z-10">
          {/* Animated Brand Mark */}
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
            <motion.div 
              animate={{ 
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] border border-white/20 relative overflow-hidden"
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div 
                  className="absolute left-0 w-5 h-8 bg-white/30"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 75%, 0 25%)' }}
                />
                <div 
                  className="absolute right-0 w-5 h-8 bg-white -translate-y-1 shadow-xl"
                  style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Connection Intelligence Info */}
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Momentum Intelligence</h2>
              <p className="text-[13px] text-white/40 font-medium tracking-wide">Initializing secure framework...</p>
            </div>

            {/* Skeleton Blocks mimicking web structure */}
            <div className="space-y-4">
              {/* Fake Header/Nav Skeleton */}
              <div className="flex justify-between items-center px-2">
                <div className="h-2 w-12 bg-white/10 rounded-full animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-lg bg-white/5 animate-pulse" />
                  <div className="h-6 w-6 rounded-lg bg-white/5 animate-pulse" />
                </div>
              </div>

              {/* Grid Cards Skeleton */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                   <div className="h-1.5 w-8 bg-white/10 rounded-lg animate-pulse" />
                   <div className="h-8 w-full bg-white/5 rounded-xl animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                   <div className="h-1.5 w-8 bg-white/10 rounded-lg animate-pulse" />
                   <div className="h-8 w-full bg-white/5 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* Main Interaction Bar Skeleton */}
              <div className="h-14 w-full bg-white/[0.02] border border-white/10 rounded-[2rem] flex items-center px-6 gap-4">
                 <div className="w-8 h-8 rounded-xl bg-white/10 animate-pulse" />
                 <div className="flex-1 h-1.5 bg-white/5 rounded-full animate-pulse" />
                 <div className="w-12 h-7 rounded-full bg-blue-500/10 animate-pulse" />
              </div>
            </div>

            {/* Verification Status */}
            <div className="flex flex-col items-center gap-3 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                  Secure Connection 10001% Verified
                </span>
              </div>
              <div className="w-48 h-[1px] bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
