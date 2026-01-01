import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, PlayCircle, Smartphone, Zap, TrendingUp, Instagram, Layers, Palette, Music, Type, CheckCircle2, Scissors, Monitor, Film, CreditCard, Lock, ShieldCheck, Check, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CapCutPageProps {
  onBack: () => void;
}

const CAPCUT_SYLLABUS = [
  { 
    id: 1, 
    title: "Introduction – Start from Zero", 
    description: "Kickstart your journey. Understand the interface, set up your workspace, and prepare for your first edit.", 
    icon: PlayCircle 
  },
  { 
    id: 2, 
    title: "Basics of Video Editing (Step-by-Step)", 
    description: "Learn the core pillars: Cutting, Trimming, Aspect Ratios, and the timeline workflow.", 
    icon: Scissors 
  },
  { 
    id: 3, 
    title: "Mobile vs PC Editing – Which One is Best for You?", 
    description: "A detailed comparison of workflow, flexibility, and power to help you choose the right platform.", 
    icon: Monitor 
  },
  { 
    id: 4, 
    title: "Different Types of Videos You Can Create", 
    description: "Explore Reels, Vlogs, Tutorials, and Cinematic edits to find your unique style and niche.", 
    icon: Film 
  },
  { 
    id: 5, 
    title: "Free vs Paid CapCut – What’s Worth It?", 
    description: "Maximize the free version and discover which Pro features are actually game-changers.", 
    icon: CreditCard 
  },
  { 
    id: 6, 
    title: "CapCut Pro Features & Live Preview Walkthrough", 
    description: "Deep dive into Auto-Cutout, AI Effects, Advanced Transitions, and vocal isolation.", 
    icon: Zap 
  },
];

const CapCutPage: React.FC<CapCutPageProps> = ({ onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState('23:59:59');

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

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

    const ctx = gsap.context(() => {
        // 1. Hero Animation Sequence
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
        )
        .fromTo(
            '.hero-btn',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)' },
            '-=0.6'
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

        // 2. Timeline Line Animation
        gsap.fromTo(lineRef.current, 
            { height: '0%' },
            {
              height: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: '.cc-timeline-container',
                start: 'top 60%',
                end: 'bottom 80%',
                scrub: 1,
              }
            }
        );

        // 3. Timeline Items Animation
        const items = gsap.utils.toArray('.cc-timeline-item');
        items.forEach((item: any, index) => {
            gsap.fromTo(item,
            { opacity: 0, x: 30, filter: 'blur(5px)' },
            {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%', 
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // 4. Pricing Card Animation
        gsap.from(pricingRef.current, {
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: pricingRef.current,
                start: 'top 85%',
            }
        });

    }, containerRef);

    return () => {
        ctx.revert();
        clearInterval(timer);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-brand-black overflow-x-hidden font-sans text-white">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-6 flex items-center justify-between pointer-events-none">
        <button 
            onClick={onBack}
            className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-105 group shadow-2xl"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-brand-blue" /> 
            <span className="font-medium text-sm">Back to Hub</span>
        </button>
      </header>

      {/* Hero Section - Redesigned to match Main Page */}
      <section className="relative min-h-[95vh] flex flex-col pt-0 overflow-hidden bg-brand-black">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
             {/* Box Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
             
             {/* Animated Blobs */}
             <div className="hero-bg-gradient absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
             <div className="hero-bg-gradient absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />
        </div>
        
        {/* Top Bar - Clean & Minimal (Urgency Timer) */}
        <div className="w-full flex justify-center pt-24 md:pt-16 z-40 relative pointer-events-none">
            <div className="glass-card px-6 py-2 rounded-full flex items-center gap-4 animate-fade-in-down pointer-events-auto">
                <div className="flex items-center gap-2">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
                     </span>
                     <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Registration Closing Soon</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10"></div>
                <span className="font-mono text-sm font-bold text-white">{timeLeft}</span>
            </div>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center justify-center flex-grow z-10 relative mt-0 md:-mt-10">
            <div className="max-w-5xl mx-auto text-center">
                
                <div className="hero-tagline flex items-center justify-center gap-3 mb-6">
                    <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gray-500"></span>
                    <span className="text-sm md:text-base text-brand-blue font-medium tracking-[0.2em] uppercase">Mobile Editing Masterclass</span>
                    <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gray-500"></span>
                </div>
                
                <h1 ref={headlineRef} className="relative group cursor-default">
                    {/* Glow effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-blue/10 rounded-full blur-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    <div className="flex flex-col items-center leading-none">
                        {/* First Line */}
                        <span className="font-serif text-5xl md:text-7xl lg:text-8xl text-white italic tracking-wide z-10 transition-transform duration-500 group-hover:-translate-y-2 drop-shadow-2xl">
                            Learn CapCut Editing
                        </span>
                        
                        {/* Second Line */}
                        <span className="font-sans text-[4.5rem] md:text-[8rem] lg:text-[10rem] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 z-10 -mt-2 md:-mt-6 lg:-mt-10 transition-transform duration-500 group-hover:translate-y-2 pb-4 md:pb-8">
                            MASTERY
                        </span>
                    </div>
                </h1>
                
                <p ref={subRef} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed mt-2 mb-10">
                    Master viral editing on <span className="text-white font-semibold">Mobile & PC</span>. 
                    Create high-quality Reels that get millions of views without expensive gear.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <button 
                      onClick={() => pricingRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      className="hero-btn group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Enroll Now - LKR 9,999 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    
                    <button 
                      onClick={() => curriculumRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      className="hero-btn flex items-center gap-2 px-8 py-4 rounded-full text-white hover:text-brand-blue transition-colors font-medium backdrop-blur-sm group"
                    >
                        <PlayCircle className="w-12 h-12 text-white/20 group-hover:text-brand-blue group-hover:scale-110 transition-all" />
                        <div className="flex flex-col items-start text-sm">
                            <span className="text-gray-400 text-xs uppercase tracking-wide">Watch Syllabus</span>
                            <span>See What You'll Learn</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll Down</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </section>

      {/* Curriculum Preview - Animated Timeline */}
      <section ref={curriculumRef} className="py-24 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                
                {/* Left Side: Sticky Text */}
                <div className="lg:w-1/3 lg:sticky lg:top-32">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-brand-blue uppercase mb-6">
                        Syllabus
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                        What You'll <br/> <span className="text-brand-blue italic">Master</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        A complete breakdown of the mobile editing workflow used by top creators.
                    </p>
                    <div className="hidden lg:block w-20 h-1 bg-brand-blue rounded-full shadow-[0_0_15px_rgba(26,193,221,0.5)]"></div>
                    
                    <div className="mt-10 p-6 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 backdrop-blur-sm hidden lg:block">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="w-6 h-6 text-brand-blue flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-white font-bold mb-1">Certificate of Completion</h4>
                                <p className="text-sm text-gray-400">Get a verified certificate to showcase your mobile editing skills.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Timeline */}
                <div className="cc-timeline-container relative lg:w-2/3 pl-4 md:pl-0 w-full">
                    {/* The Base Vertical Line */}
                    <div className="absolute left-[19px] md:left-[27px] top-8 bottom-12 w-[2px] bg-white/5 rounded-full z-0">
                        {/* The Active Vertical Line (Animated) */}
                        <div ref={lineRef} className="w-full bg-gradient-to-b from-brand-blue via-cyan-400 to-brand-blue/10 shadow-[0_0_10px_rgba(26,193,221,0.5)] rounded-full h-0"></div>
                    </div>

                    <div className="space-y-8">
                        {CAPCUT_SYLLABUS.map((module, index) => (
                            <div key={module.id} className="cc-timeline-item relative flex items-start gap-6 md:gap-10 opacity-0">
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
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                                    <module.icon className="w-6 h-6 text-brand-blue drop-shadow-[0_0_5px_rgba(26,193,221,0.8)]" />
                                                </div>
                                            </div>

                                            {/* Text Content */}
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs font-mono text-brand-blue/80 border border-brand-blue/20 px-2 py-0.5 rounded uppercase tracking-wider">Module 0{module.id}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">
                                                    {module.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm leading-relaxed">
                                                    {module.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* NEW PAYMENT SECTION */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-brand-black to-[#080808]">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div ref={pricingRef} className="max-w-3xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative">
                
                {/* Header */}
                <div className="p-8 md:p-12 text-center border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                    <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">Enroll in the CapCut Video Editing Course</h2>
                    <p className="text-gray-400 text-lg">Learn editing from scratch – Mobile & PC</p>
                </div>

                {/* Body */}
                <div className="p-8 md:p-12">
                    {/* Price Display */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
                            Limited Time Offer
                        </div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-xl text-gray-500 line-through decoration-red-500/50 decoration-2">LKR 19,999</span>
                            <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">LKR 9,999</span>
                        </div>
                        <p className="text-gray-400 mt-2 text-sm">One-time payment • Lifetime access</p>
                    </div>

                    {/* Features List */}
                    <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-brand-blue" />
                            </div>
                            <span>Lifetime course access</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-brand-blue" />
                            </div>
                            <span>Mobile + PC editing lessons</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-brand-blue" />
                            </div>
                            <span>Free & Paid CapCut explained</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-brand-blue" />
                            </div>
                            <span>Practical projects included</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 md:col-span-2 justify-center md:justify-start">
                            <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-brand-blue" />
                            </div>
                            <span>Certificate of completion</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full group relative px-8 py-5 bg-brand-blue text-white font-bold text-lg rounded-xl overflow-hidden shadow-[0_0_20px_rgba(26,193,221,0.4)] hover:shadow-[0_0_40px_rgba(26,193,221,0.6)] transition-all duration-300 hover:scale-[1.02]">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Enroll Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* Trust Signals */}
                    <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <span>100% Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-gray-400" />
                            <span>Instant Access After Payment</span>
                        </div>
                    </div>
                    
                    {/* Payment Methods Visual */}
                    <div className="mt-6 flex items-center justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <div className="h-8 px-2 bg-white rounded flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4" /></div>
                        <div className="h-8 px-2 bg-white rounded flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3" /></div>
                        <div className="h-8 px-2 bg-white rounded flex items-center font-bold text-xs text-black">UPI</div>
                        <div className="h-8 px-2 bg-white rounded flex items-center font-bold text-xs text-black">GPay</div>
                    </div>

                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default CapCutPage;