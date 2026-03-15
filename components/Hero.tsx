import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for initial load
      const tl = gsap.timeline();

      tl.fromTo(
        '.hero-tagline',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      )
      .fromTo(
        headlineRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.8'
      );

      // Parallax effect on scroll
      gsap.to('.hero-bg-gradient', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[95vh] flex flex-col pt-0 overflow-hidden bg-white">
      {/* Background Image - New Cloudinary Blue Gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/dudipr8be/image/upload/v1773599320/blue_gradient_travel_Presentation_169_1_g9reob.png" 
          alt="Tamil Editing School Background" 
          className="w-full h-full object-cover opacity-100"
          referrerPolicy="no-referrer"
        />
        {/* White gradient at the bottom, removed left side gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center justify-start pt-32 md:pt-48 pb-16 md:pb-24 flex-grow z-10 relative">
        {/* Content - Centered with more top space */}
        <div className="max-w-5xl w-full mx-auto text-center flex flex-col items-center">
          
          <div className="hero-tagline mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <span className="text-lg">🇱🇰</span>
                <span className="text-xs md:text-sm text-white font-bold uppercase tracking-[0.2em]">Srilanka’s #1 Video Editing Course</span>
            </div>
          </div>

          <h1 ref={headlineRef} className="relative group cursor-default mb-8 flex flex-col items-center">
            <div className="flex flex-col items-center leading-none">
                {/* First Line - White and Big size */}
                <span className="font-sans text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter uppercase mb-2 drop-shadow-lg">
                    Tamil Editing
                </span>
                
                {/* Second Line - White text in Cyan Box, Medium size */}
                <div className="bg-brand-blue px-8 py-2 md:px-12 md:py-3 transform -skew-x-2 shadow-2xl">
                    <span className="font-sans text-6xl md:text-[8.5rem] lg:text-[10.5rem] font-black text-white tracking-tighter uppercase leading-none block">
                        SCHOOL
                    </span>
                </div>
            </div>
          </h1>

          <p ref={subRef} className="text-lg md:text-xl text-black max-w-2xl font-sans font-medium leading-relaxed mt-6 text-center mx-auto">
            From viral <span className="text-black font-bold underline decoration-brand-blue decoration-2 underline-offset-4">Reels</span> to cinematic <span className="text-black font-bold underline decoration-brand-blue decoration-2 underline-offset-4">Films</span>. 
            Join the elite community of Tamil editors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;