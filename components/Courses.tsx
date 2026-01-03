import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Lock, Sparkles, Smartphone, Clapperboard, MonitorPlay } from 'lucide-react';
import { COURSES } from '../constants';

gsap.registerPlugin(ScrollTrigger);

interface CoursesProps {
  onSelectCourse: (courseId: string) => void;
}

const Courses: React.FC<CoursesProps> = ({ onSelectCourse }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        '.courses-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Cards Stagger
      gsap.fromTo(
        '.course-card-item',
        { y: 100, opacity: 0, rotateX: 5 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const getIcon = (id: string) => {
    switch (id) {
        case 'capcut': return <Smartphone className="w-5 h-5" />;
        case 'video-editing': return <Clapperboard className="w-5 h-5" />;
        case 'ai-filmmaking': return <Sparkles className="w-5 h-5" />;
        default: return <MonitorPlay className="w-5 h-5" />;
    }
  }

  return (
    <section id="courses-section" ref={sectionRef} className="pt-12 pb-32 bg-brand-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="courses-header text-center mb-20">
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-gray-400 uppercase mb-4">
                Curriculum
            </span>
            <h2 className="text-5xl md:text-7xl font-serif text-white mb-6">
                Choose Your <span className="italic text-brand-blue">Path</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
                Whether you're editing on a phone or a workstation, we have a specialized path to help you master the craft.
            </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {COURSES.map((course) => {
            const isAvailable = course.status === 'available';
            const isPro = course.id === 'video-editing';
            
            return (
            <div
              key={course.id}
              onClick={() => isAvailable && onSelectCourse(course.id)}
              className={`course-card-item group relative h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden border border-white/10 bg-brand-black transition-all duration-700 ${
                isAvailable 
                  ? 'cursor-pointer hover:border-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/10' 
                  : 'cursor-not-allowed opacity-60 grayscale-[0.3]'
              }`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0 bg-gray-900">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="1200"
                  className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${isPro ? 'scale-125 group-hover:scale-135' : 'group-hover:scale-110'}`} 
                />
                
                {/* Darker Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 transition-opacity duration-500" />
                
                {/* Subtle Blue Tint Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/10 via-transparent to-transparent opacity-100 pointer-events-none" />
              </div>

              {/* Status Badge */}
              <div className="absolute top-6 right-6 z-20">
                {isAvailable ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white shadow-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Enroll Now
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-gray-400">
                        <Lock className="w-3 h-3" /> Waitlist
                    </div>
                )}
              </div>

              {/* Icon Badge */}
              <div className={`absolute top-6 left-6 z-20 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md bg-gradient-to-br ${
                  isAvailable ? 'from-brand-blue/20 to-black text-brand-blue' : 'from-gray-800 to-black text-gray-400'
              }`}>
                {getIcon(course.id)}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col items-start">
                <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-300">
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="text-3xl font-serif text-white mb-3 group-hover:text-brand-blue transition-colors duration-300">
                    {course.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-[90%]">
                    {course.description}
                </p>

                <div className={`flex items-center gap-2 text-sm font-bold tracking-wide uppercase ${isAvailable ? 'text-brand-blue' : 'text-gray-500'}`}>
                    {isAvailable ? 'View Curriculum' : 'Coming Soon'}
                    <ArrowUpRight className={`w-4 h-4 transition-transform duration-300 ${isAvailable ? 'group-hover:translate-x-1 group-hover:-translate-y-1' : ''}`} />
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Courses;