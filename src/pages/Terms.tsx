import { motion } from 'motion/react';
import { Scale, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Scale className="w-3 h-3" />
            Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-display leading-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-[#86868B] font-light leading-relaxed">
            By using Kanon, you agree to the following terms. We keep it simple and transparent.
          </p>
        </motion.div>

        <div className="space-y-12 text-[#F5F5F7]">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-400" />
              One-Time Purchase
            </h2>
            <p className="text-[#86868B] leading-relaxed font-light">
              Kanon is a one-time purchase product. Once you buy it, you own that version for life. There are no recurring subscription fees. All minor updates and bug fixes are included in your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-orange-400" />
              Software Updates
            </h2>
            <p className="text-[#86868B] leading-relaxed font-light">
              We may release major new versions of Kanon in the future. While minor updates are free, significant new feature sets may be offered as a separate purchase or upgrade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Disclaimer
            </h2>
            <p className="text-[#86868B] leading-relaxed font-light">
              Kanon is a productivity tool and AI coach. While we strive for accuracy, the AI's advice should be taken as suggestions. We are not responsible for any decisions made based on AI coaching or data tracking.
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-bold mb-2">Fair Use</h3>
            <p className="text-sm text-[#86868B] font-light">
              You agree not to reverse engineer, decompile, or attempt to extract the source code of Kanon for commercial purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
