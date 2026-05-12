import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { auth, getSubscribers, db, loginWithEmail, removeSubscriber, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Shield, LogIn, Mail, User as UserIcon, Calendar, ArrowLeft, Database, Download, Trash2, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, subscriber: any } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSubscribers();
    }
  }, [user]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    const handleScroll = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchSubscribers = async () => {
    try {
      const data = await getSubscribers();
      setSubscribers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscribers. Are you an admin?');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    try {
      await loginWithEmail(cleanEmail, cleanPassword);
    } catch (err: any) {
      if (cleanEmail === 'pro679715@gmail.com') {
        try {
          const verifyRes = await fetch('/api/verify-admin-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: cleanPassword })
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.valid) {
            try {
              const { createUserWithEmailAndPassword } = await import('firebase/auth');
              await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
              return;
            } catch (regErr: any) {
              if (regErr.code === 'auth/email-already-in-use') {
                setLoginError('Admin account exists but password mismatch. Code: P-001');
              } else if (regErr.code === 'auth/operation-not-allowed') {
                setLoginError('Action Required: Enable "Email/Password" in Firebase Authentication > Sign-in method.');
              } else {
                setLoginError(`Setup Error: ${regErr.code || regErr.message}`);
              }
            }
          } else {
            // Password invalid or verification failed
            if (err.code === 'auth/user-not-found') {
              setLoginError('Identity not found. Code: I-404');
            } else if (err.code === 'auth/wrong-password') {
              setLoginError('Invalid credentials. Code: Auth-001');
            } else {
              setLoginError(`Access Denied: ${err.code || err.message}`);
            }
          }
        } catch (verifyErr) {
          console.error("Verification failed:", verifyErr);
        }
      } else {
        if (err.code === 'auth/user-not-found') {
          setLoginError('Identity not found. Code: I-404');
        } else if (err.code === 'auth/wrong-password') {
          setLoginError('Invalid access key. Code: P-401');
        } else if (err.code === 'auth/operation-not-allowed') {
          setLoginError('Action Required: Enable "Email/Password" in Firebase Authentication Console.');
        } else {
          setLoginError(`Access Denied: ${err.code || 'Unauthorized'}`);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const migrateFromCSV = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/migrate-csv');
      const data = await res.json();
      
      let migratedCount = 0;
      for (const sub of data) {
        // Check if already exists in local state to avoid duplicates during migration
        if (subscribers.some(s => s.email === sub.email)) continue;
        
        try {
          await addDoc(collection(db, "subscribers"), {
            email: sub.email,
            name: sub.name,
            joinedAt: sub.joinedAt ? Timestamp.fromDate(new Date(sub.joinedAt)) : Timestamp.now()
          });
          migratedCount++;
        } catch (err: any) {
          handleFirestoreError(err, OperationType.CREATE, 'subscribers');
        }
      }
      
      await fetchSubscribers();
      showToast(`Migration complete! ${migratedCount} new subscribers added.`);
    } catch (err: any) {
      showToast('Migration failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (subscribers.length === 0) {
      showToast('No subscribers to download.', 'error');
      return;
    }

    const headers = ['Name', 'Email', 'Joined At'];
    const csvContent = [
      headers.join(','),
      ...subscribers.map(sub => [
        `"${sub.name || ''}"`,
        `"${sub.email || ''}"`,
        `"${sub.joinedAt?.toDate ? sub.joinedAt.toDate().toISOString() : 'Recently'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kanon_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadLogo = (format: 'svg' | 'png') => {
    if (format === 'svg') {
      const link = document.createElement('a');
      link.href = '/assets/logo.svg';
      link.download = 'kanon_logo.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('SVG download started!');
    } else {
      // Create PNG via canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1024, 1024);
          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = 'kanon_logo.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('PNG download started!');
        }
      };
      img.src = '/assets/logo.svg';
    }
  };

  const handleContextMenu = (e: React.MouseEvent, sub: any) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      subscriber: sub
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await removeSubscriber(id);
      await fetchSubscribers();
      setContextMenu(null);
      setConfirmDelete(null);
      showToast('Subscriber removed successfully');
    } catch (err: any) {
      showToast('Failed to delete: ' + err.message, 'error');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(type);
    setTimeout(() => setCopyFeedback(null), 2000);
    setContextMenu(null);
  };

  const [arrivalContent, setArrivalContent] = useState('');
  const [arrivalEmail, setArrivalEmail] = useState('');
  const [isSendingArrival, setIsSendingArrival] = useState(false);
  const [isSendingBulk, setIsSendingBulk] = useState(false);

  const sendArrivalEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arrivalContent || !arrivalEmail) return;
    
    setIsSendingArrival(true);
    try {
      const res = await fetch('/api/send-arrival-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: arrivalContent, email: arrivalEmail })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Arrival email sent successfully!');
        setArrivalContent('');
        setArrivalEmail('');
      } else {
        showToast('Failed: ' + (data.error?.message || data.error || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setIsSendingArrival(false);
    }
  };

  const sendBulkEmail = async () => {
    if (!arrivalContent) {
      showToast('Please enter content in Box 1 first.', 'error');
      return;
    }
    
    if (subscribers.length === 0) {
      showToast('No subscribers to send to.', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to send this email to ALL ${subscribers.length} subscribers?`)) {
      return;
    }

    setIsSendingBulk(true);
    try {
      const res = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: arrivalContent })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Bulk send started for ${subscribers.length} users! Check logs for progress.`);
        setArrivalContent('');
      } else {
        showToast('Failed: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setIsSendingBulk(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-dark p-8 rounded-[32px] border border-white/10 text-center"
        >
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-4">Admin Login</h1>
          <p className="text-[#86868B] mb-8">Enter your credentials to manage Kanon.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <p className="text-red-400 text-xs font-medium text-center mb-4">{loginError}</p>
            )}

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kanon.com"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-white text-sm"
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-white text-sm"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#F5F5F7] transition-all disabled:opacity-50 shadow-xl mt-4"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              Sign In
            </button>
          </form>

          <Link to="/" className="inline-flex items-center gap-2 mt-8 text-xs font-bold text-[#86868B] hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter flex items-baseline gap-2">
            Kanon OS
            <span className="text-blue-500 text-5xl leading-none select-none">.</span>
          </h1>
          <p className="text-[#86868B] font-medium tracking-tight">Enterprise Network Management</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-xs font-bold text-green-400 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Download CSV
          </button>
          <button 
            onClick={migrateFromCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-xs font-bold text-blue-400 transition-all"
          >
            <Database className="w-3.5 h-3.5" />
            Migrate CSV
          </button>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white">{user.displayName || 'Admin'}</div>
            <div className="text-[10px] text-[#86868B]">{user.email}</div>
          </div>
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full border border-white/10" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-white/10 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-400" />
            </div>
          )}
          <button 
            onClick={() => auth.signOut()}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="lg:col-span-1">
          <div className="glass-dark p-8 rounded-[32px] border border-white/10 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tighter italic">The Identity</h2>
            </div>
            
            <p className="text-[10px] text-[#86868B] mb-8 font-bold uppercase tracking-[0.2em]">Current Baseline Concept</p>

            <div className="space-y-6">
              {/* Variant 1 - ONLY ONE KEPT */}
              <div className="group">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-indigo-500/30 transition-all shadow-[0_0_20px_rgba(79,70,229,0.1)]">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <div className="relative w-4 h-6 flex items-center justify-center">
                      <div className="absolute left-0 w-2 h-4 bg-white/40" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 75%, 0 25%)' }} />
                      <div className="absolute right-0 w-2 h-4 bg-white -translate-y-1 shadow-lg" style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">The Kinetic Drift</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Active Brand Strategy</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 italic text-[#86868B] text-xs leading-relaxed">
              "The stagger represents the split-second decision making of elite performers. One half grounded, one half ascending."
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-dark p-8 rounded-[32px] border border-white/10 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Arrival Email</h2>
            </div>
            <p className="text-xs text-[#86868B] mb-6 leading-relaxed">
              Send a custom update to any email. Box 1 is the content, Box 2 is the recipient.
            </p>
            <form onSubmit={sendArrivalEmail} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest ml-1">Box 1: Content</label>
                <textarea 
                  value={arrivalContent}
                  onChange={(e) => setArrivalContent(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-white text-sm min-h-[120px] resize-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest ml-1">Box 2: Recipient Email</label>
                <input 
                  type="email"
                  value={arrivalEmail}
                  onChange={(e) => setArrivalEmail(e.target.value)}
                  placeholder="xxx@gmail.com"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-white text-sm"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="submit"
                  disabled={isSendingArrival || isSendingBulk}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                >
                  {isSendingArrival ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Send One
                </button>
                <button 
                  type="button"
                  onClick={sendBulkEmail}
                  disabled={isSendingArrival || isSendingBulk}
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-purple-600/20"
                >
                  {isSendingBulk ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                  Send to All
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-dark p-8 rounded-[32px] border border-white/10 h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div 
                  className="absolute left-0 w-4 h-6 bg-indigo-400/20"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 75%, 0 25%)' }}
                />
                <div 
                  className="absolute right-0 w-4 h-6 bg-indigo-400/80 -translate-y-1"
                  style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Brand Kit</h2>
            <p className="text-xs text-[#86868B] mb-8 leading-relaxed">
              Official Kanon assets. Use these for your social media or external tracking.
            </p>
            
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-400 via-indigo-600 to-indigo-400 p-6 flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-8 border border-white/10 group cursor-pointer hover:scale-105 transition-transform duration-500 overflow-hidden relative">
              <div className="relative w-16 h-16 z-10 flex items-center justify-center">
                <div 
                  className="absolute left-0 w-8 h-12 bg-white/20"
                  style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 75%, 0 25%)' }}
                />
                <div 
                  className="absolute right-0 w-8 h-12 bg-white -translate-y-2 shadow-2xl"
                  style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </div>

            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={() => downloadLogo('svg')}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-all shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download SVG
              </button>
              <button 
                onClick={() => downloadLogo('png')}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-all shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download PNG
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {error ? (
        <div className="p-8 rounded-[32px] bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-400 font-medium mb-4">{error}</p>
          <p className="text-xs text-[#86868B]">Only authorized admins can access this data.</p>
        </div>
      ) : (
        <div className="glass-dark rounded-[32px] border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Subscriber</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Email</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Joined At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscribers.map((sub) => (
                  <tr 
                    key={sub.id} 
                    onContextMenu={(e) => handleContextMenu(e, sub)}
                    className="hover:bg-white/[0.02] transition-colors group cursor-context-menu"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-bold text-white">{sub.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-[#86868B] group-hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        {sub.email}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-[#86868B]">
                        <Calendar className="w-3.5 h-3.5" />
                        {sub.joinedAt?.toDate ? sub.joinedAt.toDate().toLocaleDateString() : 'Recently'}
                      </div>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-[#86868B] font-light">
                      No subscribers found in the Inner Circle yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Apple-style Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{ 
              left: Math.min(contextMenu.x, window.innerWidth - 220), 
              top: Math.min(contextMenu.y, window.innerHeight - 180) 
            }}
            className="fixed z-[100] w-52 glass-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl p-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 mb-1 border-b border-white/5">
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest truncate">
                {contextMenu.subscriber.name}
              </p>
            </div>
            
            <button
              onClick={() => copyToClipboard(contextMenu.subscriber.name, 'name')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-4 h-4 text-[#86868B] group-hover:text-white transition-colors" />
                <span>Copy Name</span>
              </div>
              {copyFeedback === 'name' && <Check className="w-3.5 h-3.5 text-green-400" />}
            </button>

            <button
              onClick={() => copyToClipboard(contextMenu.subscriber.email, 'email')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#86868B] group-hover:text-white transition-colors" />
                <span>Copy Email</span>
              </div>
              {copyFeedback === 'email' && <Check className="w-3.5 h-3.5 text-green-400" />}
            </button>

            <div className="h-px bg-white/5 my-1" />

            <button
              onClick={() => {
                setConfirmDelete(contextMenu.subscriber.id);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
            >
              <Trash2 className="w-4 h-4 text-red-400/70 group-hover:text-red-400 transition-colors" />
              <span>Delete Subscriber</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm glass-dark p-8 rounded-[32px] border border-white/10 text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Subscriber?</h2>
              <p className="text-[#86868B] text-sm mb-8">This action cannot be undone. Are you sure you want to remove this person from the Inner Circle?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 px-6 py-3 rounded-full font-bold text-sm shadow-2xl z-[130] flex items-center gap-2 ${
              toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-white text-black'
            }`}
          >
            {toast.type === 'error' ? <Shield className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Feedback Toast */}
      <AnimatePresence>
        {copyFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-black rounded-full font-bold text-sm shadow-2xl z-[110] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Copied {copyFeedback} to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
