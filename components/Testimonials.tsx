/* eslint-disable @typescript-eslint/no-namespace */
import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'media-id'?: string;
        aspect?: string | number;
      };
    }
  }
}

const Testimonials: React.FC = () => {
  useEffect(() => {
    if (!document.querySelector('script[src*="fast.wistia.com/player.js"]')) {
      const s1 = document.createElement('script');
      s1.src = 'https://fast.wistia.com/player.js';
      s1.async = true;
      document.head.appendChild(s1);
    }

    const embedIds = ['fjweloeip9', 'b18j9sog66'];
    embedIds.forEach((id) => {
      if (!document.querySelector(`script[src*="fast.wistia.com/embed/${id}.js"]`)) {
        const s = document.createElement('script');
        s.src = `https://fast.wistia.com/embed/${id}.js`;
        s.async = true;
        s.type = 'module';
        document.head.appendChild(s);
      }
    });
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative py-20 md:py-28 bg-slate-950 text-white overflow-hidden border-t border-slate-800">
      {/* Background glow & subtle ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-blue/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/10 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-sky-400 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Client Success Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-white mb-5 leading-tight">
            See How We Help Brands &amp; Creators <span className="text-brand-blue">Dominate Short-Form</span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Don’t just take our word for it — hear directly from business owners who scaled their audience and leads working with Clipzy.
          </p>
        </div>

        {/* 2 Testimonials Video Grid - Clean Videos Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-14">
          
          {/* Video 1 */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video">
            <wistia-player media-id="fjweloeip9" aspect="1.7777777777777777"></wistia-player>
          </div>

          {/* Video 2 */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video">
            <wistia-player media-id="b18j9sog66" aspect="1.7777777777777777"></wistia-player>
          </div>

        </div>

        {/* CTA Banner inside section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-bold text-white font-serif mb-1">
              Ready to be our next success story?
            </h4>
            <p className="text-slate-400 text-sm">
              We only accept 5 clients per month — 2 spots taken, only 3 remaining.
            </p>
          </div>

          <button
            onClick={scrollToForm}
            className="shrink-0 inline-flex items-center gap-2 bg-brand-blue hover:bg-sky-400 text-slate-950 font-black px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer"
          >
            <span>Apply For Your Spot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <style>{`
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
