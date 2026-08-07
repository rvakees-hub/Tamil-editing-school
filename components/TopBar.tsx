import React, { useState } from 'react';
import { Flame, X } from 'lucide-react';

const TopBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800 shadow-xl">
      {/* Animated subtle top glow line */}
      <div className="h-0.5 bg-gradient-to-r from-amber-500 via-sky-400 to-brand-blue w-full animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
        
        {/* Left / Center Message with Capacity Meter */}
        <div className="flex items-center gap-2 sm:gap-3.5 flex-1 justify-center sm:justify-start flex-wrap">
          
          {/* Pulsing Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold">2 / 5 Spots Closed</span>
          </div>

          {/* Copy text */}
          <p className="font-semibold text-slate-200 text-center sm:text-left leading-snug text-xs sm:text-sm">
            We only accept <strong className="text-white font-black">5 clients per month</strong>
            <br />
            <span className="text-amber-400 font-extrabold">2 spots already taken!</span>
          </p>

          {/* Mini Visual Progress Bar */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">Capacity:</div>
            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden p-0.5 flex gap-0.5">
              <div className="h-full w-[40%] bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"></div>
            </div>
            <span className="text-[11px] font-bold text-amber-400 font-mono">40% Full</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Close notification bar"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default TopBar;
