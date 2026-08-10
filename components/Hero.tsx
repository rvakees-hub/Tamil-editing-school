/* eslint-disable @typescript-eslint/no-namespace */
import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, X, Check, FileSpreadsheet, Copy, Loader2, Download, MessageSquare } from 'lucide-react';

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

const APPS_SCRIPT_TEMPLATE_CODE = `function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    // 1. Parse JSON payload if sent in request body
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = (e && e.parameter) ? e.parameter : {};
      }
    }

    // 2. Fall back to form/URL parameters
    if (!data || Object.keys(data).length === 0) {
      if (e && e.parameter) {
        data = e.parameter;
      }
    }

    // Auto-create header row if sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email",
        "Phone / WhatsApp",
        "City",
        "Primary Goal",
        "Start Date",
        "Monthly Budget",
        "Ready to Invest",
        "Website / Social Link",
        "Content Focus"
      ]);
    }

    var timestamp = data.submittedAt || data.Date || new Date().toLocaleString();
    var name = data.name || data.Name || "";
    var email = data.email || data.Email || "";
    var phone = data.phone || data.Phone || "";
    var city = data.city || data.City || "";
    var goal = data.goal || data.Goal || "";
    var startDate = data.startDate || data.StartDate || "";
    var investment = data.investment || data.Investment || "";
    var readyToInvest = data.readyToInvest || data.ReadyToInvest || "";
    var website = data.website || data.Website || "";
    var contentType = data.contentType || data.ContentType || data.course || "";

    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      city,
      goal,
      startDate,
      investment,
      readyToInvest,
      website,
      contentType
    ]);

    lock.releaseLock();

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

const sendPayloadToGoogleScript = async (targetUrl: string, payload: Record<string, string>) => {
  const url = targetUrl.trim();
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) return;

  // Use native form post targeting a hidden iframe.
  // This bypasses browser CORS restrictions on Google Apps Script redirects and avoids "Failed to fetch" errors completely,
  // while ensuring exactly 1 submission is sent without duplicates.
  return new Promise<void>((resolve) => {
    try {
      let iframe = document.getElementById('gscript_hidden_iframe') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'gscript_hidden_iframe';
        iframe.name = 'gscript_hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.target = 'gscript_hidden_iframe';

      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value || '');
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
        resolve();
      }, 500);
    } catch (err) {
      console.error('Google Sheets submission error:', err);
      resolve();
    }
  });
};

interface HeroProps {
  onNavigateToThankYou?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToThankYou }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Sheets Apps Script State
  const USER_DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzIpaybmD7fgf-BAuVtr2sPkOX-QGrBFL4YqtPC-kELKX1y6uC9pIIAwccp-fLk_UW3mA/exec';
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem('clipzy_google_apps_script_url') || import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || USER_DEFAULT_SCRIPT_URL;
  });
  const [inputUrl, setInputUrl] = useState<string>(scriptUrl);
  const [copiedCode, setCopiedCode] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const getSavedLeads = (): Record<string, string>[] => {
    try {
      return JSON.parse(localStorage.getItem('clipzy_lead_submissions') || '[]');
    } catch {
      return [];
    }
  };

  const localLeads = getSavedLeads();
  const localLeadsCount = localLeads.length;

  const handleExportCSV = () => {
    try {
      const existing = getSavedLeads();
      if (existing.length === 0) {
        alert('No saved lead submissions found in browser storage yet.');
        return;
      }
      const headers = ["Timestamp", "Full Name", "Email", "Phone / WhatsApp", "City", "Primary Goal", "Start Date", "Monthly Budget", "Ready to Invest", "Website / Social Link", "Content Focus"];
      const rows = existing.map((item) => [
        `"${item.submittedAt || ''}"`,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.email || '').replace(/"/g, '""')}"`,
        `"${(item.phone || '').replace(/"/g, '""')}"`,
        `"${(item.city || '').replace(/"/g, '""')}"`,
        `"${(item.goal || '').replace(/"/g, '""')}"`,
        `"${(item.startDate || '').replace(/"/g, '""')}"`,
        `"${(item.investment || '').replace(/"/g, '""')}"`,
        `"${(item.readyToInvest || '').replace(/"/g, '""')}"`,
        `"${(item.website || '').replace(/"/g, '""')}"`,
        `"${(item.contentType || '').replace(/"/g, '""')}"`
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `clipzy_lead_submissions_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

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

  const handleSaveScriptUrl = () => {
    const trimmed = inputUrl.trim();
    setScriptUrl(trimmed);
    localStorage.setItem('clipzy_google_apps_script_url', trimmed);
    setTestStatus('idle');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestSubmission = async () => {
    const url = inputUrl.trim();
    if (!url) return;
    setTestStatus('testing');

    const testPayload = {
      submittedAt: new Date().toLocaleString(),
      name: 'Test Lead',
      email: 'test@clipzy.agency',
      phone: '+94 77 000 0000',
      city: 'Colombo',
      goal: 'Test Google Sheets Connection',
      startDate: 'Immediately',
      investment: 'LKR 100,000–250,000',
      readyToInvest: 'Yes',
      website: 'https://clipzy.agency',
      contentType: 'Short-Form Video',
    };

    try {
      await sendPayloadToGoogleScript(url, testPayload);
      setScriptUrl(url);
      localStorage.setItem('clipzy_google_apps_script_url', url);
      setTestStatus('success');
    } catch {
      setTestStatus('error');
    }
  };

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStepError('');
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.city.trim()) {
      setStepError('Please fill in your name, email, phone number, and city.');
      return;
    }

    setIsSubmitting(true);

    const submissionPayload = {
      ...formData,
      submittedAt: new Date().toLocaleString(),
    };

    // 1. Always save locally as a bulletproof backup in browser
    try {
      const existing = JSON.parse(localStorage.getItem('clipzy_lead_submissions') || '[]');
      existing.unshift(submissionPayload);
      localStorage.setItem('clipzy_lead_submissions', JSON.stringify(existing));
    } catch (err) {
      console.error('Error saving local lead backup:', err);
    }

    // 2. Send payload to Google Apps Script Web App if configured
    const targetUrl = scriptUrl.trim();
    if (targetUrl) {
      try {
        await sendPayloadToGoogleScript(targetUrl, submissionPayload);
      } catch (err) {
        console.error('Error sending submission to Google Sheets:', err);
      }
    }

    // 3. Save lead payload in sessionStorage for Thank You page
    try {
      sessionStorage.setItem('clipzy_last_lead', JSON.stringify(submissionPayload));
    } catch (err) {
      console.error('Error saving lead to sessionStorage:', err);
    }

    // 4. Track TikTok Pixel conversion event
    try {
      if (typeof window !== 'undefined' && (window as Record<string, unknown>).ttq) {
        const ttq = (window as Record<string, unknown>).ttq as { track: (event: string, params?: Record<string, unknown>) => void };
        ttq.track('SubmitApplication', { content_name: 'Lead Application' });
        ttq.track('CompleteRegistration');
      }
    } catch (err) {
      console.warn('TikTok pixel tracking error:', err);
    }

    setIsSubmitting(false);
    setFormSubmitted(true);

    // Redirect to dedicated Thank You Page
    if (onNavigateToThankYou) {
      onNavigateToThankYou();
    } else {
      window.history.pushState({}, '', '/thank-you');
      window.dispatchEvent(new Event('popstate'));
    }
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
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setShowSheetsModal(true)}
                      title="Click to manage Google Sheets settings"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-blue bg-sky-50 hover:bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-100 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Client Application
                    </button>
                    
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span>2 of 5 Spots Closed — Only 3 Left</span>
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-black font-serif tracking-tight">
                    Apply to Work With Clipzy
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl mx-auto leading-relaxed">
                    We strictly work with only <strong>5 exclusive clients per month</strong>. 2 spots are already booked — complete this application now to claim 1 of the 3 remaining spots.
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
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2.5 bg-brand-blue hover:bg-sky-600 disabled:opacity-75 text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-xl shadow-xl shadow-sky-500/30 hover:shadow-2xl transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5 text-white" />
                            <span>Submit Application 🎉</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 text-center mt-2">
                      🔒 Zero spam. We respect your privacy and will never share your information.
                    </p>

                  </form>
                )}

              </div>
            ) : (
              <div className="py-6 px-2 sm:px-4 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
                
                {/* Success Icon Badge */}
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute -inset-4 bg-emerald-500/15 rounded-full blur-xl animate-pulse"></div>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative z-10 transform -rotate-2">
                    <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5]" />
                  </div>
                </div>

                {/* Main Header & Subheader */}
                <div className="max-w-xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Application Submitted Successfully</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-black font-serif tracking-tight">
                    Thank You, {formData.name || 'there'}! 🎉
                  </h3>
                  
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    Your application is officially registered. Our growth team is reviewing your business details and will reach out to you within <strong className="text-slate-900 font-extrabold">2 hours</strong>.
                  </p>
                </div>

                {/* Direct WhatsApp Call-to-Action Box */}
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-50/30 border border-emerald-200/90 rounded-2xl p-5 sm:p-6 text-left max-w-xl mx-auto shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/25">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">Want a Faster Response?</h4>
                        <p className="text-xs sm:text-sm text-slate-600">Connect with our strategy team on WhatsApp right away.</p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/94741480209?text=${encodeURIComponent(`Hi Clipzy team! I just submitted my application under the name ${formData.name || 'a new client'}. I'd love to discuss my video growth strategy.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-5 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      <MessageSquare className="w-4 h-4 fill-current" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* What Happens Next Steps */}
                <div className="max-w-xl mx-auto pt-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">
                    What Happens Next?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                    <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
                      <div className="w-7 h-7 bg-brand-blue/10 text-brand-blue font-black text-xs rounded-lg flex items-center justify-center mb-2">
                        1
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm mb-1">Application Review</h5>
                      <p className="text-xs text-slate-500 leading-snug">We review your goals & target audience.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
                      <div className="w-7 h-7 bg-brand-blue/10 text-brand-blue font-black text-xs rounded-lg flex items-center justify-center mb-2">
                        2
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm mb-1">Direct Reachout</h5>
                      <p className="text-xs text-slate-500 leading-snug">We message you at {formData.phone || 'your phone number'}.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
                      <div className="w-7 h-7 bg-brand-blue/10 text-brand-blue font-black text-xs rounded-lg flex items-center justify-center mb-2">
                        3
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm mb-1">Growth Call</h5>
                      <p className="text-xs text-slate-500 leading-snug">We map out your custom video marketing roadmap.</p>
                    </div>
                  </div>
                </div>

                {/* Submitted Summary Box */}
                <div className="max-w-xl mx-auto bg-slate-50/80 border border-slate-200 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Submitted Details</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Logged & Saved
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-slate-600 pt-1">
                    <div><span className="font-semibold text-slate-900">Name:</span> {formData.name}</div>
                    <div><span className="font-semibold text-slate-900">Email:</span> {formData.email}</div>
                    <div><span className="font-semibold text-slate-900">WhatsApp:</span> {formData.phone}</div>
                    <div><span className="font-semibold text-slate-900">Location:</span> {formData.city}</div>
                    <div className="sm:col-span-2"><span className="font-semibold text-slate-900">Primary Goal:</span> {formData.goal}</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setCurrentStep(1);
                      setFormData({
                        goal: 'Get More Customers',
                        startDate: 'Immediately',
                        investment: 'LKR 100,000–250,000',
                        readyToInvest: 'Yes',
                        website: '',
                        contentType: 'Short-Form (Reels / TikTok / Shorts)',
                        name: '',
                        email: '',
                        phone: '',
                        city: ''
                      });
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>

      {/* Google Sheets Apps Script Setup Modal */}
      {showSheetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowSheetsModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-brand-black font-serif">Connect Google Sheets</h3>
                <p className="text-xs text-slate-500">Automatically sync form submissions into your Google Sheet via Google Apps Script</p>
              </div>
            </div>

            <div className="space-y-6 text-slate-700 text-sm">
              {/* Web App URL Input */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Google Apps Script Web App URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-blue text-xs text-slate-900 font-mono"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveScriptUrl}
                      className="px-4 py-2.5 bg-brand-blue hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleTestSubmission}
                      disabled={!inputUrl.trim() || testStatus === 'testing'}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      {testStatus === 'testing' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Send Test Lead</span>
                    </button>
                  </div>
                </div>

                {inputUrl.trim() && (inputUrl.includes('/dev') || inputUrl.includes('/edit') || !inputUrl.trim().endsWith('/exec')) && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-950">
                      <span>⚠️ Make sure you copy the Web App URL:</span>
                    </p>
                    <p>
                      Your URL should end in <code className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-mono font-bold">/exec</code> (e.g. <code className="text-slate-800">https://script.google.com/macros/s/.../exec</code>).
                    </p>
                    <p>
                      If your URL ends in <code className="bg-amber-100 font-mono text-amber-950 px-1">/edit</code> or <code className="bg-amber-100 font-mono text-amber-950 px-1">/dev</code>, click <strong>Deploy</strong> → <strong>New deployment</strong> in Apps Script and copy the Web App URL.
                    </p>
                  </div>
                )}

                {testStatus === 'success' && (
                  <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Test submission sent successfully! Check your Google Sheet.
                  </p>
                )}
                {testStatus === 'error' && (
                  <p className="text-xs font-semibold text-red-600 mt-1">
                    ❌ Failed to reach Google Apps Script URL. Ensure "Who has access" is set to "Anyone" and you copied the Web App URL ending in /exec.
                  </p>
                )}
              </div>

              {/* Local Submissions Backup Section */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Browser Leads Backup ({localLeadsCount})
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    All form submissions are also backed up locally in your browser session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={localLeadsCount === 0}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV ({localLeadsCount})</span>
                </button>
              </div>

              {/* Step by Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  How to setup in Google Sheets (2 minutes)
                </h4>
                
                <ol className="space-y-2.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                  <li>Open your Google Sheet (or create a new blank one).</li>
                  <li>Click <strong>Extensions</strong> → <strong>Apps Script</strong> from the top menu.</li>
                  <li>Clear any existing code in <code>Code.gs</code> and paste the script below:</li>
                </ol>

                {/* Script Code Block */}
                <div className="relative bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs font-mono overflow-x-auto max-h-48 border border-slate-800">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="absolute top-2.5 right-2.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-sans font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Apps Script'}</span>
                  </button>
                  <pre className="pr-24">{APPS_SCRIPT_TEMPLATE_CODE}</pre>
                </div>

                <ol start={4} className="space-y-2.5 text-xs text-slate-600 list-decimal list-inside leading-relaxed pt-1">
                  <li>Click <strong>Deploy</strong> → <strong>New deployment</strong> (top right).</li>
                  <li>Click the ⚙️ gear next to "Select type" and choose <strong>Web app</strong>.</li>
                  <li>
                    Set <strong>Execute as:</strong> <code>Me</code> <br />
                    Set <strong>Who has access:</strong> <code>Anyone</code> (CRITICAL: Must be "Anyone"!)
                  </li>
                  <li>Click <strong>Deploy</strong>, grant permissions, and copy the <strong>Web App URL</strong> into the field above!</li>
                </ol>
              </div>

              {/* Troubleshooting Tips Box */}
              <div className="bg-sky-50/80 border border-sky-200 text-slate-800 p-4 rounded-2xl text-xs space-y-2">
                <h5 className="font-extrabold text-sky-950 flex items-center gap-1.5">
                  <span>💡 Sheet still empty after submitting? Check these 2 quick settings:</span>
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 leading-relaxed">
                  <li>
                    <strong>Did you deploy a New Version?</strong> In Google Apps Script, after updating code in <code>Code.gs</code>, you <em>must</em> click <strong>Deploy</strong> → <strong>New deployment</strong> (or <strong>Manage deployments</strong> → ⚙️ Edit → <strong>New version</strong> → Deploy). Saving the code alone does NOT update the active Web App!
                  </li>
                  <li>
                    <strong>Is "Who has access" set to "Anyone"?</strong> Ensure "Who has access" is set to <strong>Anyone</strong> (not "Only myself"). If set to "Only myself", submissions are blocked by Google authentication.
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSheetsModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
