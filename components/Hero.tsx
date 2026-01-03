import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const [timeLeft, setTimeLeft] = useState('23:59:59');

  useEffect(() => {
    // Countdown Logic
    const timer = setInterval(() => {
      const date = new Date();
      const hours = 23 - date.getHours();
      const minutes = 59 - date.getMinutes();
      const seconds = 59 - date.getSeconds();
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    <div ref={containerRef} className="relative min-h-[95vh] flex flex-col pt-0 overflow-hidden bg-brand-black">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Box Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Animated Blobs */}
        <div className="hero-bg-gradient absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="hero-bg-gradient absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Top Bar - Clean & Minimal */}
      <div className="w-full flex justify-center pt-6 z-50">
        <div className="glass-card px-6 py-2 rounded-full flex items-center gap-4 animate-fade-in-down">
            <div className="flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                 </span>
                 <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Registration Closing Soon</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <span className="font-mono text-sm font-bold text-white">{timeLeft}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center justify-center flex-grow z-10 relative">
        {/* Content */}
        <div className="max-w-5xl mx-auto text-center">
          
          <div className="hero-tagline flex items-center justify-center gap-3 mb-6">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gray-500"></span>
            <span className="text-sm md:text-base text-brand-blue font-medium tracking-[0.2em] uppercase">The #1 Platform for Creators</span>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gray-500"></span>
          </div>

          <h1 ref={headlineRef} className="relative group cursor-default">
            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-blue/20 rounded-full blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="flex flex-col items-center leading-none">
                {/* First Line */}
                <span className="font-serif text-5xl md:text-7xl lg:text-8xl text-white italic tracking-wide z-10 transition-transform duration-500 group-hover:-translate-y-2 drop-shadow-2xl">
                    Tamil Editing
                </span>
                
                {/* Second Line */}
                <span className="font-sans text-[5rem] md:text-[8rem] lg:text-[11rem] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 z-10 -mt-2 md:-mt-6 lg:-mt-10 transition-transform duration-500 group-hover:translate-y-2 pb-4 md:pb-8">
                    SCHOOL
                </span>
            </div>
          </h1>

          <p ref={subRef} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed mt-2 mb-10">
            From viral <span className="text-white font-semibold">Reels</span> to cinematic <span className="text-white font-semibold">Films</span>. 
            Join the elite community of Tamil editors and master the art of storytelling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;