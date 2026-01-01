import React from 'react';
import { ArrowRight, Instagram, Youtube, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-black pt-20 pb-10 relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Large CTA Card */}
        <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-b from-[#0a0a0a] to-black p-8 md:p-20 text-center mb-20 group">
          {/* Glow Effect Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-brand-blue/15 transition-colors duration-700"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white mb-8 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
              Join Us Now
            </span>
            
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-8 leading-tight max-w-5xl mx-auto">
              Each Story You Tell is a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-200 to-brand-blue animate-gradient-x">Unique Opportunity</span>
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Ready to take the next step? Join us now and start transforming your vision into reality with expert support.
            </p>
            
            <button className="group relative px-10 py-5 bg-brand-blue text-white font-bold text-lg rounded-full overflow-hidden hover:shadow-[0_0_40px_-10px_rgba(26,193,221,0.6)] transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Book an Appointment <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Footer Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-10">
           <div className="text-center md:text-left">
               <h3 className="text-xl font-serif text-white mb-2">Tamil Creators Academy</h3>
               <p className="text-gray-500 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
           </div>

           <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" />
                <span>support@tamilcreators.com</span>
           </div>
           
           <div className="flex items-center gap-6">
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-blue hover:scale-110 transition-all duration-300">
                <Instagram className="w-5 h-5"/>
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 hover:scale-110 transition-all duration-300">
                <Youtube className="w-5 h-5"/>
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-400 hover:scale-110 transition-all duration-300">
                <Twitter className="w-5 h-5"/>
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-700 hover:scale-110 transition-all duration-300">
                <Linkedin className="w-5 h-5"/>
             </a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;