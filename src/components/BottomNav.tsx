import { motion } from 'motion/react';
import { Home, Sparkles, CreditCard, MessageSquare, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Features', path: '/features', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Coach', path: '/ai-coach', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Pricing', path: '/pricing', icon: <CreditCard className="w-4 h-4" /> },
    { name: 'FAQ', path: '/faq', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md">
      <div className="bg-black/40 backdrop-blur-xl rounded-full px-2 py-2 border border-white/10 flex items-center justify-between shadow-2xl">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-full transition-all duration-300 ${
                isActive ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#3B82F6' : 'currentColor'
                }}
              >
                {item.icon}
              </motion.div>
              <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
