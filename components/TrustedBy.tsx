import React from 'react';

const ROW1_IMAGES = [
  "https://res.cloudinary.com/drztakw1p/image/upload/v1774542718/1_iebrcv.png",
  "https://res.cloudinary.com/drztakw1p/image/upload/v1774542717/2_tnqd3s.png",
  "https://res.cloudinary.com/drztakw1p/image/upload/v1774542721/7_yi7ls5.png",
  "https://res.cloudinary.com/drztakw1p/image/upload/v1774542726/6_q8gogp.png"
];

const ROW2_IMAGES = [
  "https://res.cloudinary.com/drztakw1p/image/upload/v1774542720/8_ejub5z.png",
  "https://res.cloudinary.com/drztakw1p/image/upload/v1774542718/4_irxyqs.png",
  "https://res.cloudinary.com/drztakw1p/image/upload/v1774542726/3_ib9nh7.png",
  "https://res.cloudinary.com/drztakw1p/image/upload/v1774542724/5_i2cypd.png"
];

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

      {/* Infinite Scroll Marquee - Row 1 (Left) */}
      <div className="relative w-full overflow-hidden mb-8">
        <div 
            className="flex w-max items-center animate-marquee-left hover:[animation-play-state:paused] will-change-transform"
            style={{ 
                animation: 'marquee-left 40s linear infinite',
                width: 'max-content'
            }}
        >
          {/* Triple the list to ensure smooth infinite loop on wide screens */}
          {[...ROW1_IMAGES, ...ROW1_IMAGES, ...ROW1_IMAGES].map((image, index) => (
            <div 
              key={`row1-${index}`}
              className="mx-2 md:mx-4 relative flex-shrink-0"
            >
              <div className="
                w-[calc(100vw/3-16px)] h-[180px] md:w-[320px] md:h-[460px] 
                rounded-2xl md:rounded-3xl overflow-hidden relative 
                border border-slate-200
                bg-slate-50 backdrop-blur-sm
                group
              ">
                <img 
                  src={image} 
                  alt={`Trusted creator ${index}`} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Scroll Marquee - Row 2 (Right) */}
      <div className="relative w-full overflow-hidden">
        <div 
            className="flex w-max items-center animate-marquee-right hover:[animation-play-state:paused] will-change-transform"
            style={{ 
                animation: 'marquee-right 40s linear infinite',
                width: 'max-content'
            }}
        >
          {/* Triple the list to ensure smooth infinite loop on wide screens */}
          {[...ROW2_IMAGES, ...ROW2_IMAGES, ...ROW2_IMAGES].map((image, index) => (
            <div 
              key={`row2-${index}`}
              className="mx-2 md:mx-4 relative flex-shrink-0"
            >
              <div className="
                w-[calc(100vw/3-16px)] h-[180px] md:w-[320px] md:h-[460px] 
                rounded-2xl md:rounded-3xl overflow-hidden relative 
                border border-slate-200
                bg-slate-50 backdrop-blur-sm
                group
              ">
                <img 
                  src={image} 
                  alt={`Trusted creator ${index}`} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TrustedBy;