import React, { useRef } from 'react';
import { Plus } from 'lucide-react';

interface CohortCurriculumProps {
  onEnroll?: () => void;
}

const CohortCurriculum: React.FC<CohortCurriculumProps> = ({ onEnroll }) => {
  const curriculumRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={curriculumRef} className="py-24 relative bg-black overflow-hidden selection:bg-[#E2FF00] selection:text-black">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-7xl font-bold text-white text-center mb-20 tracking-tighter uppercase">
          What you'll learn in this <span className="text-white">Cohort</span>
        </h2>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: Advanced Video Editing (Large - Spans 2 columns on desktop) */}
          <div className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 p-8 md:p-14 group transition-all duration-500 hover:border-white/20">
            {/* Background Number */}
            <div className="absolute top-[-2rem] left-8 text-[15rem] md:text-[22rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none tracking-tighter">1</div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-start lg:items-center justify-between">
              <div className="max-w-xl">
                <h3 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                  Advanced <br /> Video Editing
                </h3>
                <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed font-medium">
                  Master the art of storytelling with industry-standard software and advanced editing techniques.
                </p>
                <button 
                  onClick={onEnroll}
                  className="px-12 py-5 bg-[#E2FF00] text-black font-black text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(226,255,0,0.2)] active:scale-95 uppercase tracking-wider"
                >
                  Join now
                </button>
              </div>

              <div className="w-full lg:w-auto flex flex-col gap-10">
                {/* Software Icons */}
                <div className="flex gap-5 justify-start lg:justify-end">
                  <div className="w-16 h-16 rounded-2xl bg-[#00005B] border border-white/10 flex items-center justify-center text-[#00A9FF] font-bold text-2xl shadow-2xl transform hover:scale-110 transition-transform cursor-default">Ae</div>
                  <div className="w-16 h-16 rounded-2xl bg-[#00005B] border border-white/10 flex items-center justify-center text-[#E78DFF] font-bold text-2xl shadow-2xl transform hover:scale-110 transition-transform cursor-default">Pr</div>
                  <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center p-3 shadow-2xl transform hover:scale-110 transition-transform cursor-default">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio_17_logo.png" alt="DaVinci" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                </div>

                {/* Feature List */}
                <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 md:p-10 backdrop-blur-xl min-w-[320px] shadow-2xl">
                  <ul className="space-y-8">
                    <li className="flex items-center gap-5 text-gray-200 group/item">
                      <Plus className="w-6 h-6 text-gray-500 group-hover/item:text-[#E2FF00] transition-colors" />
                      <span className="text-xl font-semibold">A → Z of Video Editing</span>
                    </li>
                    <li className="flex items-center gap-5 text-gray-200 group/item">
                      <Plus className="w-6 h-6 text-gray-500 group-hover/item:text-[#E2FF00] transition-colors" />
                      <span className="text-xl font-semibold">Advanced Motion Graphics in After Effects</span>
                    </li>
                    <li className="flex items-center gap-5 text-gray-200 group/item">
                      <Plus className="w-6 h-6 text-gray-500 group-hover/item:text-[#E2FF00] transition-colors" />
                      <span className="text-xl font-semibold">Advanced Color Grading in DaVinci Resolve</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Social Media Growth */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 p-10 group h-full transition-all duration-500 hover:border-white/20">
            <div className="absolute top-[-1rem] left-4 text-[12rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none tracking-tighter">2</div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-10 leading-tight tracking-tight">
                Social Media <br /> Growth
              </h3>
              <ul className="space-y-5">
                {['Content Planning & Packaging', 'Scripting', 'Storytelling', 'SEO', 'Basics of Cinematography'].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-gray-400 text-base font-medium group/item">
                    <Plus className="w-5 h-5 text-gray-600 group-hover/item:text-[#E2FF00] transition-colors" />
                    <span className="group-hover/item:text-gray-200 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Subtle Graph Line at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700">
              <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d">
                <path d="M0,80 Q25,60 50,80 T100,20" fill="none" stroke="#E2FF00" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Card 3: Freelancing & Agency Building */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 p-10 group h-full transition-all duration-500 hover:border-white/20">
            <div className="absolute top-[-1rem] left-4 text-[12rem] font-bold text-white/[0.02] leading-none select-none pointer-events-none tracking-tighter">3</div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-10 leading-tight tracking-tight">
                Freelancing <br /> & Agency Building
              </h3>
              <ul className="space-y-5">
                {['How, where & when to reach out to clients?', 'Basics of Marketing', 'How to Negotiate Prices?', 'How to Scale an Agency?'].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-gray-400 text-base font-medium group/item">
                    <Plus className="w-5 h-5 text-gray-600 group-hover/item:text-[#E2FF00] transition-colors" />
                    <span className="group-hover/item:text-gray-200 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CohortCurriculum;
