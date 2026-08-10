import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  Lock,
  Flame
} from 'lucide-react';

interface SubmittedLead {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  goal?: string;
  investment?: string;
  contentType?: string;
  startDate?: string;
  submittedAt?: string;
}

interface ThankYouPageProps {
  onGoHome: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onGoHome }) => {
  const [lead] = useState<SubmittedLead | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem('clipzy_last_lead');
      if (stored) {
        return JSON.parse(stored);
      }
      const listStr = localStorage.getItem('clipzy_lead_submissions');
      if (listStr) {
        const list = JSON.parse(listStr);
        if (Array.isArray(list) && list.length > 0) {
          return list[0];
        }
      }
    } catch (e) {
      console.warn('Error reading lead data:', e);
    }
    return null;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const userName = lead?.name || 'Valued Client';
  const whatsappNumber = '94741480209';
  const whatsappMsg = encodeURIComponent(
    `Hi Clipzy team! I just submitted my application under the name ${userName}. I'd love to discuss my video growth strategy.`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-brand-blue selection:text-white flex flex-col justify-between">
      
      {/* Top Bar / Header Nav */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-hidden"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-blue to-sky-400 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-brand-blue/30 group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white block leading-none">CLIPZY</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Video Growth Agency</span>
            </div>
          </button>

          {/* Return Home Button */}
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 sm:space-y-12">
        
        {/* Celebration Header Section */}
        <div className="text-center space-y-6">
          
          {/* Success Badge */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative z-10 transform -rotate-3">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Application Confirmed & Received</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-serif">
              Thank You, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">{userName}</span>!
            </h1>

            <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-xl mx-auto">
              Your growth application has been logged into our client queue. Our strategy team is currently reviewing your details and will connect with you within <strong className="text-white">2 hours</strong>.
            </p>
          </div>
        </div>

        {/* WhatsApp Immediate Action Box */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>Fast-Track Your Onboarding</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Want to connect with us immediately?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md">
                Skip the wait time! Send a direct message to our head strategist on WhatsApp to discuss your custom content roadmap right now.
              </p>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base px-7 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp Now</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* What Happens Next - 3 Step Roadmap */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Next Steps Roadmap</h3>
            <p className="text-xl sm:text-2xl font-bold text-white">What Happens After You Apply?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
              <div className="w-9 h-9 bg-brand-blue/20 text-brand-blue font-black text-sm rounded-xl flex items-center justify-center border border-brand-blue/30">
                01
              </div>
              <h4 className="font-bold text-white text-base">Account & Goal Audit</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We review your current brand, target audience, and primary revenue goals to evaluate strategy fit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
              <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 font-black text-sm rounded-xl flex items-center justify-center border border-emerald-500/30">
                02
              </div>
              <h4 className="font-bold text-white text-base">Direct Reachout</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Our growth team will contact you via WhatsApp ({lead?.phone || 'your phone number'}) within 2 hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
              <div className="w-9 h-9 bg-amber-500/20 text-amber-400 font-black text-sm rounded-xl flex items-center justify-center border border-amber-500/30">
                03
              </div>
              <h4 className="font-bold text-white text-base">Video Strategy Call</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                We present a tailored short-form video editing and viral content roadmap for your business.
              </p>
            </div>
          </div>
        </div>

        {/* Submitted Details Card */}
        {lead && (
          <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Submitted Application Summary
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Logged & Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-slate-400 text-xs">Full Name</span>
                <p className="font-semibold text-white">{lead.name || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs">Email Address</span>
                <p className="font-semibold text-white">{lead.email || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs">WhatsApp / Phone</span>
                <p className="font-semibold text-white">{lead.phone || 'N/A'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-xs">City / Country</span>
                <p className="font-semibold text-white">{lead.city || 'N/A'}</p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-slate-400 text-xs">Primary Business Goal</span>
                <p className="font-semibold text-emerald-400">{lead.goal || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} CLIPZY Agency. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 inline" /> 100% Confidential & Secure Submissions
          </p>
        </div>
      </footer>

    </div>
  );
};

export default ThankYouPage;
