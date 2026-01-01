import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HOW_IT_WORKS } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left Side Text Animation
      gsap.fromTo(
        '.hiw-text',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
        }
      );

      // Timeline Line Animation
      // The inner div fills up the height of the outer container
      gsap.fromTo(lineRef.current, 
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          }
        }
      );

      // Timeline Items Animation
      const items = gsap.utils.toArray('.timeline-item');
      items.forEach((item: any, index) => {
        gsap.fromTo(item,
          { opacity: 0, x: 50, filter: 'blur(10px)' },
          {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%', // Start animating when top of item hits 85% of viewport
              toggleActions: 'play none none reverse'
            },
            delay: index * 0.1 // Slight stagger
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-brand-black relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
            {/* Left Side: Text */}
            <div className="hiw-text lg:w-1/3 lg:sticky lg:top-32">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                    Your Path to <br/> <span className="text-brand-blue italic">Mastery</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    A structured learning path designed to take you from a complete beginner to a paid professional editor.
                </p>
                <div className="hidden lg:block w-20 h-1 bg-brand-blue rounded-full shadow-[0_0_15px_rgba(26,193,221,0.5)]"></div>
            </div>

            {/* Right Side: Vertical Timeline */}
            <div className="timeline-container relative lg:w-2/3 pl-4 md:pl-0 w-full">
                {/* The Base Vertical Line (Dim) */}
                <div className="absolute left-[19px] md:left-[27px] top-8 bottom-12 w-[2px] bg-white/5 rounded-full z-0">
                    {/* The Active Vertical Line (Glowing) - Controlled by GSAP */}
                    <div ref={lineRef} className="w-full bg-gradient-to-b from-brand-blue via-cyan-400 to-brand-blue/10 shadow-[0_0_10px_rgba(26,193,221,0.5)] rounded-full"></div>
                </div>

                <div className="space-y-8">
                    {HOW_IT_WORKS.map((step, index) => {
                        // Dynamic color mapping based on index or predefined accent
                        const isEven = index % 2 === 0;
                        
                        return (
                            <div key={step.id} className="timeline-item relative flex items-start gap-6 md:gap-10">
                                {/* Dot on the line */}
                                <div className="relative z-10 flex-shrink-0 mt-6">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-2xl relative">
                                        <div className="absolute inset-0 rounded-full bg-brand-blue/10 blur-md"></div>
                                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-brand-blue border-2 border-white shadow-[0_0_10px_rgba(26,193,221,0.8)] z-10"></div>
                                    </div>
                                </div>
                                
                                {/* Content Card */}
                                <div className="flex-grow group">
                                    <div className="relative overflow-hidden p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all duration-300 hover:border-brand-blue/40 hover:bg-white/[0.05] hover:shadow-[0_10px_30px_-10px_rgba(26,193,221,0.1)]">
                                        
                                        {/* Hover Gradient Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
                                            {/* Icon Box */}
                                            <div className="flex-shrink-0">
                                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                                    <step.icon className="w-6 h-6 text-brand-blue drop-shadow-[0_0_5px_rgba(26,193,221,0.8)]" />
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs font-mono text-brand-blue/80 border border-brand-blue/20 px-2 py-0.5 rounded uppercase tracking-wider">Step 0{step.id}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;