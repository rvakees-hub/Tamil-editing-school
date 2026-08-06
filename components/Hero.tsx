/* eslint-disable @typescript-eslint/no-namespace */
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, X, Check } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'media-id'?: string;
        aspect?: string | number;
      };
    }
  }
}

const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: 4 questions
    goal: 'Get More Customers',
    startDate: 'Immediately',
    investment: 'LKR 100,000–250,000',
    readyToInvest: 'Yes',
    // Step 2: 2 questions
    website: '',
    contentType: 'Short-Form (Reels / TikTok / Shorts)',
    // Step 3: 4 questions
    name: '',
    email: '',
    phone: '',
    city: ''
  });

  useEffect(() => {
    // Load Wistia scripts dynamically if needed
    if (!document.querySelector('script[src*="fast.wistia.com/player.js"]')) {
      const s1 = document.createElement('script');
      s1.src = 'https://fast.wistia.com/player.js';
      s1.async = true;
      document.head.appendChild(s1);
    }
    if (!document.querySelector('script[src*="fast.wistia.com/embed/nsqv30rryo.js"]')) {
      const s2 = document.createElement('script');
      s2.src = 'https://fast.wistia.com/embed/nsqv30rryo.js';
      s2.async = true;
      s2.type = 'module';
      document.head.appendChild(s2);
    }
  }, []);

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStepError('');
    if (currentStep === 1) {
      if (!formData.goal || !formData.startDate || !formData.investment || !formData.readyToInvest) {
        setStepError('Please complete all 4 questions before proceeding.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.website.trim()) {
        setStepError('Please provide your business website or social media link.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.city.trim()) {
      setStepError('Please fill in your name, email, phone number, and city.');
      return;
    }
    setFormSubmitted(true);
  };

  // Calculate percentage
  const getProgressPercentage = () => {
    if (currentStep === 1) return 33;
    if (currentStep === 2) return 66;
    return 100;
  };

  return (
    <section className="relative min-h-[85vh] bg-white text-brand-black pt-10 pb-20 md:pt-14 md:pb-28 overflow-hidden select-none">
      
      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        
        {/* Top Header Logo */}
        <div className="flex justify-center items-center mb-8 md:mb-10">
          <img 
            src="https://res.cloudinary.com/dudipr8be/image/upload/v1786041103/Clipzy_5_dhvoox.png" 
            alt="CLIPZY Logo" 
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
          />
        </div>

        {/* Main Header Headline (Matching TrustedBy typography & color palette) */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-black tracking-tight text-brand-black leading-[1.08] font-serif">
            More Views. More Leads
          </h1>
          
          {/* Highlighted Badge: "More Revenue." */}
          <div className="mt-2 md:mt-3 inline-block">
            <div className="bg-brand-blue text-white px-7 py-2 md:px-10 md:py-3.5 rounded-2xl md:rounded-3xl shadow-xl shadow-sky-500/20 inline-flex items-center justify-center">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-black tracking-tight font-serif">
                More Revenue.
              </span>
            </div>
          </div>
        </div>

        {/* Video Card Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Card Frame with 7px rounded corners & shadow */}
          <div className="relative rounded-[7px] overflow-hidden bg-slate-900 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.25)] border border-slate-200">
            <wistia-player media-id="nsqv30rryo" aspect="1.7777777777777777" class="w-full block rounded-[7px] overflow-hidden"></wistia-player>
          </div>
        </div>

        {/* Multi-Step Lead Application Form Section below the video */}
        <div id="application-form" className="mt-10 md:mt-16 max-w-3xl mx-auto w-full scroll-mt-10">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-slate-200/80 border border-slate-200/90 relative overflow-hidden">
            
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-blue via-sky-500 to-blue-600"></div>

            {!formSubmitted ? (
              <div>
                {/* Form Headline & Subheadline */}
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-blue bg-sky-50 px-3.5 py-1.5 rounded-full mb-3 border border-sky-100">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Client Application
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-black font-serif tracking-tight">
                    Apply to Work With Clipzy
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl mx-auto leading-relaxed">
                    We work with a limited number of businesses each month. Complete this short application.
                  </p>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="mb-8 max-w-xl mx-auto">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Step {currentStep} of 3
                    </span>
                    <span className="text-xs font-black text-brand-blue bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                      {getProgressPercentage()}% Completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <div 
                      className="bg-gradient-to-r from-brand-blue to-sky-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                {/* Error Banner */}
                {stepError && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center">
                    {stepError}
                  </div>
                )}

                {/* STEP 1: 4 QUIZ QUESTIONS */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Q1: Biggest Goal */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        1. What is your biggest goal? <span className="text-brand-blue">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          'Get More Customers',
                          'Build Brand Awareness',
                          'Increase Sales',
                          'Build My Personal Brand',
                          'Launch a New Product',
                          'Other'
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, goal: option })}
                            className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                              formData.goal === option
                                ? 'bg-sky-50/80 border-brand-blue text-brand-blue shadow-sm ring-1 ring-brand-blue'
                                : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <span>{option}</span>
                            {formData.goal === option && (
                              <Check className="w-4 h-4 text-brand-blue shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q2: When to start */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        2. When are you looking to start? <span className="text-brand-blue">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          'Immediately',
                          'Within 30 Days',
                          'Within 3 Months',
                          'Just Exploring'
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, startDate: option })}
                            className={`flex items-center justify-center p-3 rounded-xl border text-center text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                              formData.startDate === option
                                ? 'bg-sky-50/80 border-brand-blue text-brand-blue shadow-sm ring-1 ring-brand-blue'
                                : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q3: Monthly Investment */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        3. What's your monthly investment for video marketing? <span className="text-brand-blue">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          'Under LKR 50,000',
                          'LKR 50,000–100,000',
                          'LKR 100,000–250,000',
                          'Above LKR 250,000'
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, investment: option })}
                            className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                              formData.investment === option
                                ? 'bg-sky-50/80 border-brand-blue text-brand-blue shadow-sm ring-1 ring-brand-blue'
                                : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <span>{option}</span>
                            {formData.investment === option && (
                              <Check className="w-4 h-4 text-brand-blue shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q4: Ready to invest 100k+ */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        4. Are you ready to invest LKR 100,000+ per month? <span className="text-brand-blue">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Yes', 'Maybe', 'No'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, readyToInvest: option })}
                            className={`flex items-center justify-center p-3.5 rounded-xl border text-center text-sm font-bold transition-all cursor-pointer ${
                              formData.readyToInvest === option
                                ? 'bg-sky-50/80 border-brand-blue text-brand-blue shadow-sm ring-1 ring-brand-blue'
                                : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <span>{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 1 Action */}
                    <div className="pt-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleNextStep()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-sky-600 text-white font-extrabold text-base sm:text-lg px-10 py-4 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl transition-all cursor-pointer"
                      >
                        <span>Continue to Step 2</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                )}

                {/* STEP 2: 2 QUESTIONS (Business & Content) */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Q5: Business Website or Social Media Link */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        5. Business Website or Social Media Link <span className="text-brand-blue">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="Facebook, Instagram, TikTok, LinkedIn or Website"
                        value={formData.website}
                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-500/20 text-slate-900 text-sm bg-slate-50/50 focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Q6: Primary Content Format Needed */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        6. What type of video content do you need? <span className="text-brand-blue">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          'Short-Form (Reels / TikTok / Shorts)',
                          'Long-Form (YouTube / VSLs)',
                          'Paid Ad Creatives',
                          'Full Video Marketing Growth'
                        ].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, contentType: option })}
                            className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                              formData.contentType === option
                                ? 'bg-sky-50/80 border-brand-blue text-brand-blue shadow-sm ring-1 ring-brand-blue'
                                : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                            }`}
                          >
                            <span>{option}</span>
                            {formData.contentType === option && (
                              <Check className="w-4 h-4 text-brand-blue shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2 Actions */}
                    <div className="pt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNextStep()}
                        className="inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-sky-600 text-white font-extrabold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-xl transition-all cursor-pointer"
                      >
                        <span>Continue to Final Step</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>

                  </div>
                )}

                {/* STEP 3: 4 CONTACT QUESTIONS & SUBMIT */}
                {currentStep === 3 && (
                  <form onSubmit={handleFormSubmit} className="space-y-6 animate-in fade-in duration-300">
                    
                    <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 text-center">
                      <p className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                        Almost Done! Step 3 of 3
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Where should our team send your custom Video Growth Plan?
                      </p>
                    </div>

                    {/* Q7: Full Name */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        7. Full Name <span className="text-brand-blue">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Alex Johnson"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-500/20 text-slate-900 text-sm bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Q8: Email Address */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        8. Email Address <span className="text-brand-blue">*</span>
                      </label>
                      <input 
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-500/20 text-slate-900 text-sm bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Q9: WhatsApp / Phone Number */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        9. WhatsApp / Phone Number <span className="text-brand-blue">*</span>
                      </label>
                      <input 
                        type="tel"
                        required
                        placeholder="e.g. +94 77 123 4567"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-500/20 text-slate-900 text-sm bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Q10: City / Location */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        10. City / Location <span className="text-brand-blue">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Colombo, Kandy, Jaffna, or International"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-sky-500/20 text-slate-900 text-sm bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Step 3 Actions */}
                    <div className="pt-4 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2.5 bg-brand-blue hover:bg-sky-600 text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-xl shadow-xl shadow-sky-500/30 hover:shadow-2xl transition-all cursor-pointer"
                      >
                        <Calendar className="w-5 h-5 text-white" />
                        <span>Submit Application 🎉</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 text-center mt-2">
                      🔒 Zero spam. We respect your privacy and will never share your information.
                    </p>

                  </form>
                )}

              </div>
            ) : (
              <div className="text-center py-10 space-y-5 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-brand-black font-serif">Application Received!</h3>
                  <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base mt-2 leading-relaxed">
                    Thank you, <span className="font-bold text-slate-900">{formData.name}</span>. Our growth team is reviewing your application and will reach out on WhatsApp/Email within 2 hours.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setFormSubmitted(false);
                      setCurrentStep(1);
                    }}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Booking Form Modal (kept for secondary CTA access if needed) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center py-4">
              <h3 className="text-2xl font-black text-brand-black font-serif">Apply Below</h3>
              <p className="text-sm text-slate-500 mt-1">Please complete the application form directly on the page.</p>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  const el = document.getElementById('application-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-4 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold text-sm"
              >
                Go To Application Form
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Hero;
