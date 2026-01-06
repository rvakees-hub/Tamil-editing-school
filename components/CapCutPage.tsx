import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, PlayCircle, Zap, CheckCircle2, Scissors, Monitor, Film, CreditCard, Check, ChevronDown, Award, X, User, Mail, Phone, Music, Sparkles, Layers, Activity, Clock, Loader2, Calendar, Target, TrendingUp, Briefcase, Radio } from 'lucide-react';
import { TRUSTED_CREATORS } from '../constants';

gsap.registerPlugin(ScrollTrigger);

interface CapCutPageProps {
  onBack: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
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
  {
    id: 7,
    title: "Audio Editing Made Easy",
    description: "Add music, voiceovers, sound effects, and balance audio like a pro.",
    icon: Music
  },
  {
    id: 8,
    title: "AI Tools & Smart Editing Features",
    description: "Use CapCut AI for auto captions, smart effects, and faster editing.",
    icon: Sparkles
  },
  {
    id: 9,
    title: "Masking & Visual Effects",
    description: "Create cinematic looks, overlays, and professional effects using masking.",
    icon: Layers
  },
  {
    id: 10,
    title: "Keyframe Animation & Motion Effects",
    description: "Add smooth zooms, movements, and animations using keyframes.",
    icon: Activity
  }
];

const CapCutPage: React.FC<CapCutPageProps> = ({ onBack, isModalOpen, setIsModalOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const curriculumRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const mentorshipRef = useRef<HTMLDivElement>(null);
  
  const [timeLeft, setTimeLeft] = useState('06:00:00');
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Scroll Handler for Sticky Header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);

    // Countdown Logic (6 Hour Cycles)
    const updateTimer = () => {
      const date = new Date();
      // Calculate remaining time in a 6-hour window (0-6, 6-12, 12-18, 18-24)
      const currentHour = date.getHours();
      const remainingHours = 5 - (currentHour % 6);
      const remainingMinutes = 59 - date.getMinutes();
      const remainingSeconds = 59 - date.getSeconds();
      
      setTimeLeft(
        `${remainingHours.toString().padStart(2, '0')}:${remainingMinutes
          .toString()
          .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
      );
    };

    // Initial call
    updateTimer();
    
    const timer = setInterval(updateTimer, 1000);

    const ctx = gsap.context(() => {
        // 1. Hero Animation Sequence
        const tl = gsap.timeline();

        // Animate Video First
        tl.fromTo(
            '.wistia-embed',
            { y: 40, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
        )
        .fromTo(
            '.hero-tagline',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.5'
        )
        .fromTo(
            headlineRef.current,
            { y: 50, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' },
            '-=0.6'
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
        
        // 4. Certificate Animation
        if (certificateRef.current) {
            gsap.from(certificateRef.current.children, {
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: certificateRef.current,
                    start: 'top 70%',
                }
            });
        }
        
        // 5. Mentorship Animation (Robust Fade In)
        if (mentorshipRef.current) {
             gsap.fromTo(mentorshipRef.current.querySelectorAll('.mentorship-content'), 
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: mentorshipRef.current,
                        start: 'top 75%',
                    }
                }
            );
        }

        // 6. Pricing Card Animation
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
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleEnrollClick = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const SHEETDB_URL = 'https://sheetdb.io/api/v1/ccdajtboqrtax'; 
    
    try {
        const response = await fetch(SHEETDB_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    Name: formData.name,
                    Email: formData.email,
                    Phone: formData.phone,
                    Date: new Date().toLocaleString()
                }
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful! We will contact you shortly.");
            setIsModalOpen(false);
            setFormData({ name: '', email: '', phone: '' });
        } else {
            console.error('Submission failed', data);
            alert("Something went wrong. Please try again or contact support.");
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        alert("Connection error. Please check your internet connection.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const [hours, minutes, seconds] = timeLeft.split(':');

  return (
    <div ref={containerRef} className="min-h-screen bg-brand-black overflow-x-hidden font-sans text-white pb-20">
      {/* Navigation Header - Top Offer Banner */}
      <header className="fixed top-0 left-0 w-full z-50 py-6 pointer-events-none flex justify-center">
         <div className="pointer-events-auto glass-card px-5 py-2.5 rounded-full flex items-center gap-3 animate-fade-in-down hover:bg-white/5 transition-colors cursor-default border border-brand-blue/20 shadow-[0_0_20px_rgba(26,193,221,0.1)] backdrop-blur-xl bg-brand-black/30">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-blue"></span>
             </span>
             <span className="text-xs font-bold text-white uppercase tracking-wider">Launch Offer • 50% OFF Ends Soon</span>
        </div>
      </header>

      {/* Hero Section - Video Top, Text Bottom */}
      <section className="relative min-h-[90vh] flex flex-col pt-24 pb-12 overflow-hidden bg-brand-black">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
             <div className="hero-bg-gradient absolute top-[-10%] left-[50%] -translate-x-1/2 w-[80%] h-[60%] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center justify-start flex-grow z-10 relative">
            <div className="max-w-4xl w-full mx-auto text-center flex flex-col items-center">
                
                {/* Wistia Video Embed - NOW AT THE TOP */}
                <div className="wistia-embed w-full mb-12 flex flex-col items-center justify-center">
                    <div className="w-full rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(26,193,221,0.2)] hover:shadow-[0_0_60px_rgba(26,193,221,0.4)] transition-all duration-500 border border-brand-blue/20 bg-black relative z-20 group">
                         <div className="wistia_responsive_padding" style={{padding:'56.25% 0 0 0', position:'relative'}}>
                             <div className="wistia_responsive_wrapper" style={{height:'100%', left:0, position:'absolute', top:0, width:'100%'}}>
                                 <iframe src="https://fast.wistia.net/embed/iframe/oe07wkx76z?web_component=true&seo=true" title="cupcut landing page video" allow="autoplay; fullscreen" allowTransparency={true} frameBorder="0" scrolling="no" className="wistia_embed" name="wistia_embed" width="100%" height="100%"></iframe>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Text Content - NOW BELOW VIDEO */}
                <div className="hero-tagline flex items-center justify-center gap-3 mb-6">
                    <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gray-500"></span>
                    <span className="text-sm md:text-base text-brand-blue font-medium tracking-[0.2em] uppercase">Mobile Editing Masterclass</span>
                    <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gray-500"></span>
                </div>
                
                <h1 ref={headlineRef} className="relative group cursor-default mb-6">
                    <div className="flex flex-col items-center leading-none">
                        <span className="font-serif text-5xl md:text-6xl lg:text-7xl text-white italic tracking-wide z-10 drop-shadow-2xl">
                            Learn CapCut Editing
                        </span>
                        <span className="font-sans text-[4rem] md:text-[6rem] lg:text-[8rem] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 z-10 -mt-2 md:-mt-4 lg:-mt-6 pb-2">
                            MASTERY
                        </span>
                    </div>
                </h1>
                
                <p ref={subRef} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-sans leading-relaxed mb-8">
                    Master viral editing on <span className="text-white font-semibold">Mobile & PC</span>. 
                    Create high-quality Reels that get millions of views without expensive gear.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <button 
                      onClick={handleEnrollClick}
                      className="hero-btn group relative px-8 py-4 bg-brand-blue text-black font-bold rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(26,193,221,0.5)]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Enroll Now - LKR 9,999 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* Sticky Bottom Footer - Timer & CTA */}
      <div className={`fixed bottom-0 left-0 w-full z-40 transition-all duration-500 transform ${isScrolled ? 'translate-y-0' : 'translate-y-0'}`}>
         <div className="bg-brand-black/90 backdrop-blur-xl border-t border-white/10 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
             <div className="container mx-auto flex items-center justify-between">
                 <div className="flex items-center gap-3 md:gap-4">
                     <div className="hidden md:flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Offer ends in</span>
                        <span className="font-mono text-xl font-bold text-white tabular-nums">{timeLeft}</span>
                     </div>
                     {/* Mobile Timer Compact */}
                     <div className="md:hidden flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                         <Clock className="w-3 h-3 text-brand-blue animate-pulse" />
                         <span className="font-mono text-sm font-bold text-white">{timeLeft}</span>
                     </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                     <div className="hidden md:block text-right">
                         <div className="text-xs text-gray-400 line-through">LKR 19,999</div>
                         <div className="text-lg font-bold text-white">LKR 9,999</div>
                     </div>
                     <button 
                        onClick={handleEnrollClick}
                        className="bg-brand-blue text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-white transition-colors shadow-[0_0_15px_rgba(26,193,221,0.4)]"
                     >
                        Enroll Now
                     </button>
                 </div>
             </div>
         </div>
      </div>

      {/* TRAINERS WORKED WITH SECTION - Moved to Second Section */}
      <section className="relative py-24 overflow-hidden border-t border-white/5 bg-brand-black">
        <div className="container mx-auto px-4 mb-16 text-center relative z-10">
          <h3 className="text-sm font-bold tracking-[0.2em] text-brand-blue uppercase mb-3">
            Industry Experts
          </h3>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Trainers worked with
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Learn from the experience of editors who have worked with top creators.
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
                  border border-white/10
                  bg-brand-blue/5 backdrop-blur-sm
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-80"></div>
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
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center shadow-2xl relative">
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

                    {/* NEW CTA: After Syllabus */}
                    <div className="mt-16 flex justify-center">
                        <button 
                            onClick={handleEnrollClick}
                            className="group relative px-8 py-4 bg-brand-blue text-black font-bold rounded-full overflow-hidden hover:scale-105 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start Learning Today <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
      </section>

      {/* NEW WEEKLY LIVE MENTORSHIP SECTION - TOP 1% UI REDESIGN */}
      <section ref={mentorshipRef} className="py-32 relative overflow-hidden bg-brand-black border-t border-white/5">
         
         {/* Background Decor: Right Side Glow Blob */}
         <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-brand-blue/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
         {/* Subtle pattern overlay */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
         
         <div className="container mx-auto px-4 lg:px-8 relative z-10">
            
            <div className="grid lg:grid-cols-12 gap-16 items-start">
                
                {/* Left Side: Headline & Live Pass - FIXED STICKY BUG ON MOBILE */}
                <div className="mentorship-content lg:col-span-5 flex flex-col items-start relative lg:sticky lg:top-24 mb-24 lg:mb-0">
                    {/* Badge */}
                    <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Live Weekly Access
                    </span>
                    
                    <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-[1.1]">
                        Not Just a Course. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-300 to-white italic">A Career Launcher.</span>
                    </h2>
                    
                    <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
                        We don't leave you after the videos. Join us live every week to master the business of editing and fast-track your success.
                    </p>

                    {/* Schedule Ticket Card - UPDATED TO WHITE BACKGROUND */}
                    <div className="w-full relative overflow-hidden rounded-3xl bg-white border border-transparent shadow-2xl shadow-brand-blue/5 backdrop-blur-md group hover:shadow-brand-blue/10 transition-all duration-500">
                         {/* Card Background Glow - Removed for cleaner white look */}
                         
                         <div className="p-8 md:p-10 relative z-10">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 animate-pulse-slow flex-shrink-0">
                                        <Radio className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold tracking-widest text-red-600 uppercase">Live On Zoom</span>
                                </div>
                                <div className="px-3 py-1 rounded-lg bg-gray-100 border border-gray-200 text-xs text-gray-600 font-mono flex-shrink-0">
                                    GMT+5:30
                                </div>
                            </div>

                            <div className="space-y-12">
                                <div className="flex items-start gap-6">
                                    <div className="mt-1 flex-shrink-0">
                                        <Calendar className="w-7 h-7 text-brand-blue" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold text-brand-black mb-2">Every Friday</h4>
                                        <p className="text-gray-600">Mark your calendar for weekly growth</p>
                                    </div>
                                </div>
                                
                                <div className="w-full h-px bg-gray-100"></div>
                                
                                <div className="flex items-start gap-6">
                                    <div className="mt-1 flex-shrink-0">
                                        <Clock className="w-7 h-7 text-brand-blue" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-bold text-brand-black mb-2">7:30 PM</h4>
                                        <p className="text-gray-600">90 Minutes • Q&A + Live Editing</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA inside card */}
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <button 
                                    onClick={handleEnrollClick}
                                    className="w-full py-4 rounded-xl bg-brand-black hover:bg-brand-blue text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-blue/30 text-lg"
                                >
                                    Get Access Pass <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Right Side: Bento Grid (Reverted to Dark Glass style) */}
                <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5 w-full">
                    
                    {/* Card 1 */}
                    <div className="mentorship-content p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-brand-blue/20 transition-all duration-300 group backdrop-blur-sm">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-transparent border border-white/5 flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(26,193,221,0.1)]">
                            <TrendingUp className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors">Income & Freelancing</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Stop editing for free. Learn how to find high-paying international clients, structure your pricing, and close deals with confidence.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="mentorship-content p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-brand-blue/20 transition-all duration-300 group backdrop-blur-sm sm:translate-y-12">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-transparent border border-white/5 flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(26,193,221,0.1)]">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors">Agency Blueprint</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A complete roadmap to scaling from a solo freelancer to an agency owner. Delegate work, build a team, and automate your income.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="mentorship-content p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-brand-blue/20 transition-all duration-300 group backdrop-blur-sm">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-transparent border border-white/5 flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(26,193,221,0.1)]">
                            <Monitor className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors">Live Edit Reviews</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Don't guess if your work is good. We review student projects live on the call, fixing mistakes and polishing your portfolio in real-time.
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="mentorship-content p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-brand-blue/20 transition-all duration-300 group backdrop-blur-sm sm:translate-y-12">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-transparent border border-white/5 flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(26,193,221,0.1)]">
                            <Target className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors">Professional Mindset</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Technical skills are only 50%. We train you to think, communicate, and deliver quality like a top-1% professional editor.
                        </p>
                    </div>

                </div>
            </div>
            
            <div className="mt-20 md:mt-32 text-center mentorship-content">
                <button 
                    onClick={handleEnrollClick}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-blue font-medium transition-colors group"
                >
                    Join the waiting list for next batch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
         </div>
      </section>

      {/* PAYMENT SECTION */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-brand-black to-brand-dark">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
            <div ref={pricingRef} className="max-w-3xl mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 bg-brand-dark/40 backdrop-blur-xl shadow-2xl relative">
                
                {/* Header */}
                <div className="p-8 md:p-12 text-center border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                    <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">Enroll in the CapCut Video Editing Course</h2>
                    <p className="text-gray-400 text-lg">Learn editing from scratch – Mobile & PC</p>
                    
                    {/* Beautiful Countdown */}
                    <div className="flex justify-center gap-4 mt-8">
                        <div className="flex flex-col items-center bg-brand-black/40 border border-brand-blue/20 rounded-xl p-3 min-w-[80px] backdrop-blur-sm shadow-lg shadow-brand-blue/5">
                            <span className="text-3xl font-bold text-white font-mono">{hours}</span>
                            <span className="text-[10px] text-brand-blue uppercase tracking-widest mt-1">Hrs</span>
                        </div>
                        <div className="flex flex-col items-center bg-brand-black/40 border border-brand-blue/20 rounded-xl p-3 min-w-[80px] backdrop-blur-sm shadow-lg shadow-brand-blue/5">
                            <span className="text-3xl font-bold text-white font-mono">{minutes}</span>
                            <span className="text-[10px] text-brand-blue uppercase tracking-widest mt-1">Mins</span>
                        </div>
                        <div className="flex flex-col items-center bg-brand-black/40 border border-brand-blue/20 rounded-xl p-3 min-w-[80px] backdrop-blur-sm shadow-lg shadow-brand-blue/5">
                            <span className="text-3xl font-bold text-white font-mono">{seconds}</span>
                            <span className="text-[10px] text-brand-blue uppercase tracking-widest mt-1">Secs</span>
                        </div>
                    </div>
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

                    {/* CTA Button with Click Handler */}
                    <button 
                        onClick={handleEnrollClick}
                        className="w-full group relative px-8 py-5 bg-brand-blue text-black font-bold text-lg rounded-xl overflow-hidden shadow-[0_0_20px_rgba(26,193,221,0.4)] hover:shadow-[0_0_40px_rgba(26,193,221,0.6)] transition-all duration-300 hover:scale-[1.02]"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Register Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* REMOVED TRUST SIGNALS AND PAYMENT ICONS */}

                </div>
            </div>
        </div>
      </section>

      {/* ENROLLMENT MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setIsModalOpen(false)}
            ></div>
            
            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md bg-brand-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-gradient-to-r from-brand-blue/5 to-transparent flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-white">Secure Your Spot</h3>
                        <p className="text-xs text-brand-blue mt-1 font-medium">Limited Seats Remaining</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-blue transition-colors" />
                            <input 
                                type="text" 
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-blue transition-colors" />
                            <input 
                                type="email" 
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">WhatsApp Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-blue transition-colors" />
                            <input 
                                type="tel" 
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g. 077 123 4567"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-blue/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full mt-4 bg-brand-blue hover:bg-cyan-400 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(26,193,221,0.3)] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Register Now <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-500">
                        By clicking above, you agree to receive course updates via email/WhatsApp.
                    </p>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default CapCutPage;