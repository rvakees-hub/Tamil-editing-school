import React from 'react';
import { TRUSTED_CREATORS } from '../constants';

const TrustedBy: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden border-t border-slate-100 bg-white">
      <div className="container mx-auto px-4 mb-16 text-center relative z-10">
        <h3 className="text-sm font-bold tracking-[0.2em] text-brand-blue uppercase mb-3">
          Trusted By The Best
        </h3>
        <h2 className="text-4xl md:text-5xl font-serif text-brand-black mb-4">
          We've Worked With
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto">
          From top YouTubers to global brands, our alumni are editing for the biggest names in the industry.
        </p>
      </div>

      {/* Infinite Scroll Marquee */}
      <div className="relative w-full overflow-hidden">
        <div 
            className="flex w-max items-center animate-marquee hover:[animation-play-state:paused] will-change-transform"
            style={{ 
                animation: 'marquee 60s linear infinite',
                width: 'max-content'
            }}
        >
          {/* Triple the list to ensure smooth infinite loop on wide screens */}
          {[...TRUSTED_CREATORS, ...TRUSTED_CREATORS, ...TRUSTED_CREATORS].map((creator, index) => (
            <div 
              key={`creator-${index}`}
              className="mx-4 relative flex-shrink-0"
            >
              {/* Card Container */}
              <div className="
                w-[280px] h-[400px] md:w-[320px] md:h-[460px] 
                rounded-3xl overflow-hidden relative 
                border border-slate-200
                bg-slate-50 backdrop-blur-sm
                group
              ">
                {/* Image */}
                <img 
                  src={creator.image} 
                  alt={creator.name} 
                  loading="lazy"
                  decoding="async"
                  width="320"
                  height="460"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Subtle Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TrustedBy;