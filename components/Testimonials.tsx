/* eslint-disable @typescript-eslint/no-namespace */
import React, { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'media-id'?: string;
        aspect?: string | number;
        'player-color'?: string;
        playerColor?: string;
      };
    }
  }
}

const testimonialVideoIds = [
  'pvb3fhe4bb',
  '6ydt6ld61i',
  'fjweloeip9',
  'b18j9sog66',
];

const Testimonials: React.FC = () => {
  useEffect(() => {
    if (!document.querySelector('script[src*="fast.wistia.com/player.js"]')) {
      const s1 = document.createElement('script');
      s1.src = 'https://fast.wistia.com/player.js';
      s1.async = true;
      document.head.appendChild(s1);
    }

    testimonialVideoIds.forEach((id) => {
      if (!document.querySelector(`script[src*="fast.wistia.com/embed/${id}.js"]`)) {
        const s = document.createElement('script');
        s.src = `https://fast.wistia.com/embed/${id}.js`;
        s.async = true;
        s.type = 'module';
        document.head.appendChild(s);
      }
    });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-brand-black mb-3">
            Verified Client Results
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Hear directly from creators and brands scaling with Clipzy.
          </p>
        </div>

        {/* Video Embeds Only Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonialVideoIds.map((id) => (
            <div 
              key={id} 
              className="relative rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-200 aspect-video"
            >
              <wistia-player media-id={id} aspect="1.7777777777777777"></wistia-player>
            </div>
          ))}
        </div>

      </div>

      {/* Swatch Preload Styles */}
      <style>{`
        wistia-player[media-id='pvb3fhe4bb']:not(:defined) { 
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/pvb3fhe4bb/swatch'); 
          display: block; 
          filter: blur(5px); 
          padding-top:56.25%; 
        }
        wistia-player[media-id='6ydt6ld61i']:not(:defined) { 
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/6ydt6ld61i/swatch'); 
          display: block; 
          filter: blur(5px); 
          padding-top:56.25%; 
        }
        wistia-player[media-id='fjweloeip9']:not(:defined) { 
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/fjweloeip9/swatch'); 
          display: block; 
          filter: blur(5px); 
          padding-top:56.25%; 
        }
        wistia-player[media-id='b18j9sog66']:not(:defined) { 
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/b18j9sog66/swatch'); 
          display: block; 
          filter: blur(5px); 
          padding-top:56.25%; 
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
