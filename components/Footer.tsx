import React from 'react';

interface FooterProps {
  onEnroll?: () => void;
  shouldAddPadding?: boolean;
}

const Footer: React.FC<FooterProps> = ({ shouldAddPadding = false }) => {
  return (
    <footer className={`bg-white pt-12 relative overflow-hidden border-t border-slate-100 ${shouldAddPadding ? 'pb-32 md:pb-28' : 'pb-10'}`}>
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Footer Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 pb-4">
           <div className="flex flex-col items-center text-center">
               <p className="text-slate-500 text-sm mb-1">© {new Date().getFullYear()} CLIPZY. All rights reserved.</p>
               <p className="text-xs text-slate-400">
                 More Views. More Leads. More Revenue.
               </p>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;