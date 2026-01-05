import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  onEnroll?: () => void;
  shouldAddPadding?: boolean;
}

const Footer: React.FC<FooterProps> = ({ onEnroll, shouldAddPadding = false }) => {
  return (
    <footer className={`bg-brand-black pt-20 relative overflow-hidden border-t border-white/5 ${shouldAddPadding ? 'pb-32 md:pb-28' : 'pb-10'}`}>
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
               <p className="text-gray-500 text-sm mb-2">© {new Date().getFullYear()} All rights reserved.</p>
               <p className="text-xs text-gray-600">
                 Course managed by <a href="https://www.upbold.global/" target="_blank" rel="noopener noreferrer" className="text-brand-blue/70 hover:text-brand-blue transition-colors">UPBOLD</a>
               </p>
           </div>
           
           {/* Social Media Links */}
           <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/tamileditingschool" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 hover:border-brand-blue/30 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/tamileditingschool/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 hover:border-brand-blue/30 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@tamileditingschool?_r=1&_t=ZS-92na1MCafY8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 hover:border-brand-blue/30 transition-all duration-300"
                aria-label="TikTok"
              >
                {/* TikTok Icon SVG */}
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;