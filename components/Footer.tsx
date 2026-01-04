import React from 'react';
import { ArrowRight, Instagram, Youtube, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  onEnroll?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onEnroll }) => {
  return (
    <footer className="bg-brand-black pt-20 pb-10 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Large CTA Card */}
        <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-b from-brand-dark to-brand-black p-8 md:p-20 text-center mb-20 group">
          {/* Glow Effect Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-brand-blue/15 transition-colors duration-700"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white mb-8 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
              Join Us Now
            </span>
            
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-8 leading-tight max-w-5xl mx-auto">
              Turn Your Ideas into Powerful Videos <br />
             
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Join the CapCut Video Editing Course and turn your ideas into high-quality videos.
            </p>
            
            <button 
              onClick={onEnroll}
              className="px-10 py-5 bg-brand-blue text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(26,193,221,0.4)] flex items-center gap-2 hover:bg-white hover:text-brand-blue duration-300"
            >
                Enroll Now <ArrowRight className="w-5 h-5" />
            </button>
            
          </div>
        </div>

        {/* Footer Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-10">
           <div className="text-center md:text-left">
               <h3 className="text-xl font-serif text-white mb-2">Tamil Editing School</h3>
               <p className="text-gray-500 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;