import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Shield className="w-3 h-3" />
            Privacy First
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-display leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#86868B] font-light leading-relaxed">
            Last updated: March 14, 2026. Your privacy is not a feature; it's a fundamental right.
          </p>
        </motion.div>

        <div className="space-y-12 text-[#F5F5F7]">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              Data Collection
            </h2>
            <p className="text-[#86868B] leading-relaxed font-light">
              Kanon is designed with a "Local-First" architecture. This means your habit data, task lists, and focus session history are stored directly on your device. We do not collect, store, or have access to your personal productivity data on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              AI Processing
            </h2>
            <p className="text-[#86868B] leading-relaxed font-light">
              When you interact with the AI Coach, your messages are processed by Google's Gemini API. This data is used solely to provide you with coaching insights. We do not use your chat history for marketing or advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Your Rights
            </h2>
            <p className="text-[#86868B] leading-relaxed font-light">
              Since your data is stored locally, you have full control over it. You can export your data to CSV or clear it entirely at any time through the settings menu. We do not track your location or use third-party cookies for tracking.
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-bold mb-2">Questions?</h3>
            <p className="text-sm text-[#86868B] font-light">
              If you have any questions about our privacy practices, please contact our support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
