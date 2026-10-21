/* eslint-disable @typescript-eslint/no-namespace */
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Check, 
  FileSpreadsheet, 
  Copy, 
  Loader2, 
  Download, 
  MessageSquare,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Lock,
  X
} from 'lucide-react';
import { identifyTikTokUser, trackTikTokEvent } from './tiktokPixel';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'media-id'?: string;
        aspect?: string | number;
        'player-color'?: string;
        playerColor?: string;
        class?: string;
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

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) {
      throw new Error("No active spreadsheet found. Make sure this script was created via Extensions > Apps Script from inside your Google Sheet.");
    }
    var sheet = ss.getSheetByName("Leads") || ss.getActiveSheet() || ss.getSheets()[0];
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
      var headerRow = [
        "Timestamp",
        "Full Name",
        "Email",
        "Phone Number",
        "City",
        "Business Name"
      ];
      sheet.appendRow(headerRow);
      var headerRange = sheet.getRange(1, 1, 1, headerRow.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1AC1DD");
      headerRange.setFontColor("#0F172A");
    }

    var timestamp = data.submittedAt || data.Timestamp || data.Date || new Date().toLocaleString();
    var name = data.name || data.Name || data["Full Name"] || "";
    var email = data.email || data.Email || "";
    var phone = data.phone || data.Phone || data["Phone Number"] || "";
    var city = data.city || data.City || "";
    var businessName = data.businessName || data.BusinessName || data["Business Name"] || data.business_name || "";

    // Deduplication guard: ignore if identical email or phone was already inserted recently
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var checkStart = Math.max(2, lastRow - 15);
      var numToCheck = lastRow - checkStart + 1;
      var recentData = sheet.getRange(checkStart, 2, numToCheck, 3).getValues(); // [Name, Email, Phone]
      var curEmail = String(email || '').trim().toLowerCase();
      var curPhone = String(phone || '').trim().replace(/[^0-9]/g, '');
      for (var r = 0; r < recentData.length; r++) {
        var rowEmail = String(recentData[r][1] || '').trim().toLowerCase();
        var rowPhone = String(recentData[r][2] || '').trim().replace(/[^0-9]/g, '');
        if ((curEmail && rowEmail === curEmail) || (curPhone && rowPhone && rowPhone === curPhone)) {
          lock.releaseLock();
          return ContentService
            .createTextOutput(JSON.stringify({ result: "success", status: 200, message: "Duplicate prevented" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      city,
      businessName
    ]);

    lock.releaseLock();

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", status: 200 }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

// Client-side submission debounce to prevent duplicate triggers
const recentlySentLeads = new Map<string, number>();

const sendPayloadToGoogleScript = async (targetUrl: string, payload: Record<string, string>): Promise<boolean> => {
  const url = targetUrl.trim();
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) return false;

  // Deduplication signature: Name + Email + Phone
  const sig = `${(payload.name || '').trim().toLowerCase()}_${(payload.email || '').trim().toLowerCase()}_${(payload.phone || '').trim().replace(/\D/g, '')}`;
  const now = Date.now();
  const lastTime = recentlySentLeads.get(sig);
  if (lastTime && (now - lastTime) < 60000) {
    console.log('Skipping duplicate submission for signature:', sig);
    return true;
  }
  recentlySentLeads.set(sig, now);

  // Clean old signatures
  if (recentlySentLeads.size > 50) {
    recentlySentLeads.forEach((time, key) => {
      if (now - time > 120000) recentlySentLeads.delete(key);
    });
  }

  // Exactly ONE submission method: Hidden form POST targeting isolated hidden iframe
  try {
    let iframe = document.getElementById('gscript_hidden_iframe') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'gscript_hidden_iframe';
      iframe.name = 'gscript_hidden_iframe';
      iframe.style.display = 'none';
      iframe.setAttribute('aria-hidden', 'true');
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
    }, 1000);
    return true;
  } catch (formErr) {
    console.warn('Hidden form submission error:', formErr);
    return false;
  }
};

interface HeroProps {
  onNavigateToThankYou?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToThankYou }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [stepError, setStepError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Sheets Apps Script State
  const USER_DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzljZkwSd9UbqTBhqQeSELIsuuN53h5wvjTBVSzyUAhKqlW8Lgr9skqVXhwwcxRpn98sA/exec';
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    const saved = localStorage.getItem('clipzy_google_apps_script_url');
    if (!saved || saved.includes('AKfycbzIpaybmD7fgf')) {
      localStorage.setItem('clipzy_google_apps_script_url', USER_DEFAULT_SCRIPT_URL);
      return USER_DEFAULT_SCRIPT_URL;
    }
    return saved;
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
      const headers = ["Timestamp", "Full Name", "Email", "Phone Number", "City", "Business Name"];
      const rows = existing.map((item) => [
        `"${item.submittedAt || ''}"`,
        `"${(item.name || '').replace(/"/g, '""')}"`,
        `"${(item.email || '').replace(/"/g, '""')}"`,
        `"${(item.phone || '').replace(/"/g, '""')}"`,
        `"${(item.city || '').replace(/"/g, '""')}"`,
        `"${(item.businessName || '').replace(/"/g, '""')}"`
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
    name: '',
    email: '',
    phone: '',
    city: '',
    businessName: ''
  });

  useEffect(() => {
    // Wistia player scripts are loaded via index.html. Safely check before adding.
    try {
      if (!document.querySelector('script[src*="fast.wistia.com/player.js"]')) {
        const s1 = document.createElement('script');
        s1.src = 'https://fast.wistia.com/player.js';
        s1.async = true;
        document.head.appendChild(s1);
      }
      if (!document.querySelector('script[src*="fast.wistia.com/embed/bpd49n1j8u.js"]')) {
        const s2 = document.createElement('script');
        s2.src = 'https://fast.wistia.com/embed/bpd49n1j8u.js';
        s2.async = true;
        s2.type = 'module';
        document.head.appendChild(s2);
      }
    } catch {
      // Ignore script insertion errors if running in restricted sandboxes
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
      businessName: 'Clipzy Media',
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setStepError('');
    if (
      !formData.name.trim() || 
      !formData.email.trim() || 
      !formData.phone.trim() || 
      !formData.city.trim() || 
      !formData.businessName.trim()
    ) {
      setStepError('Please fill in all fields (Name, Email, Phone Number, City, and Business Name).');
      return;
    }

    setIsSubmitting(true);

    const timestamp = new Date().toLocaleString();
    const submissionPayload = {
      name: formData.name.trim(),
      Name: formData.name.trim(),
      'Full Name': formData.name.trim(),
      email: formData.email.trim(),
      Email: formData.email.trim(),
      phone: formData.phone.trim(),
      Phone: formData.phone.trim(),
      'Phone Number': formData.phone.trim(),
      city: formData.city.trim(),
      City: formData.city.trim(),
      businessName: formData.businessName.trim(),
      BusinessName: formData.businessName.trim(),
      'Business Name': formData.businessName.trim(),
      submittedAt: timestamp,
      Timestamp: timestamp,
      Date: timestamp,
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
      sessionStorage.setItem('clipzy_conversion_pending', 'true');
    } catch (err) {
      console.error('Error saving lead to sessionStorage:', err);
    }

    // 4. Send TikTok PII identify and Lead event
    try {
      await identifyTikTokUser({
        email: formData.email,
        phone_number: formData.phone,
        external_id: formData.email || formData.phone,
      });

      trackTikTokEvent('Lead', {
        contents: [
          {
            content_id: 'lead_application',
            content_type: 'product',
            content_name: 'Lead Application Form',
          },
        ],
        value: 100,
        currency: 'USD',
      });
    } catch (err) {
      console.warn('TikTok Lead tracking error:', err);
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

        {/* Main Header Headline & Subheadline */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
          <h1 className="font-black tracking-tight text-slate-950 leading-[1.15] font-sans flex flex-col items-center">
            <span className="block text-[45px]">Build Your Personal Brand</span>
            <span className="inline-block mt-2 sm:mt-3 text-[41px] whitespace-nowrap bg-[#1AC1DD] text-slate-950 px-5 sm:px-8 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-lg shadow-[#1AC1DD]/30 font-black">
              in Just 90 Days.
            </span>
          </h1>
          
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            We create high-converting business videos that turn attention into paying clients.
          </p>
        </div>

        {/* Video Card Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Card Frame with 7px rounded corners & shadow */}
          <div className="relative rounded-[7px] overflow-hidden bg-slate-900 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.25)] border border-slate-200">
            <wistia-player 
              media-id="bpd49n1j8u" 
              aspect="1.7777777777777777" 
              player-color="1AC1DD"
              class="w-full block rounded-[7px] overflow-hidden"
            ></wistia-player>
          </div>
        </div>

        {/* Lead Application Form Section below the video */}
        <div id="application-form" className="mt-10 md:mt-16 max-w-3xl mx-auto w-full scroll-mt-10">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-slate-200/80 border border-slate-200/90 relative overflow-hidden">
            
            {/* Top decorative accent bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-blue via-sky-400 to-[#1AC1DD]"></div>

            {!formSubmitted ? (
              <div>
                {/* Form Headline & Subheadline */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-black font-serif tracking-tight">
                    Apply to Work With Clipzy
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-xl mx-auto leading-relaxed font-sans">
                    Fill out the form below to start scaling your brand with high-performing short-form video.
                  </p>
                </div>

                {/* Error Banner */}
                {stepError && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center">
                    {stepError}
                  </div>
                )}

                {/* Direct 5-Input Application Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* 1. Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 ml-1">
                        Name <span className="text-[#1AC1DD] font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1AC1DD] transition-colors" />
                        <input 
                          type="text" 
                          name="name"
                          required
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1AC1DD] focus:ring-4 focus:ring-[#1AC1DD]/10 rounded-xl pl-10 pr-4 py-3 sm:py-3.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    {/* 2. Business Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 ml-1">
                        Business Name <span className="text-[#1AC1DD] font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1AC1DD] transition-colors" />
                        <input 
                          type="text" 
                          name="businessName"
                          required
                          placeholder="e.g. Acme Studio, Nova Clinic"
                          value={formData.businessName}
                          onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1AC1DD] focus:ring-4 focus:ring-[#1AC1DD]/10 rounded-xl pl-10 pr-4 py-3 sm:py-3.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    {/* 3. Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 ml-1">
                        Email <span className="text-[#1AC1DD] font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1AC1DD] transition-colors" />
                        <input 
                          type="email" 
                          name="email"
                          required
                          placeholder="you@company.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1AC1DD] focus:ring-4 focus:ring-[#1AC1DD]/10 rounded-xl pl-10 pr-4 py-3 sm:py-3.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    {/* 4. Phone Number */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 ml-1">
                        Phone Number <span className="text-[#1AC1DD] font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1AC1DD] transition-colors" />
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          placeholder="e.g. +94 77 123 4567"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1AC1DD] focus:ring-4 focus:ring-[#1AC1DD]/10 rounded-xl pl-10 pr-4 py-3 sm:py-3.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    {/* 5. City */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5 ml-1">
                        City <span className="text-[#1AC1DD] font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1AC1DD] transition-colors" />
                        <input 
                          type="text" 
                          name="city"
                          required
                          placeholder="e.g. Colombo, Kandy, Jaffna, or International"
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1AC1DD] focus:ring-4 focus:ring-[#1AC1DD]/10 rounded-xl pl-10 pr-4 py-3 sm:py-3.5 text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none transition-all shadow-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative inline-flex items-center justify-center gap-2.5 bg-[#1AC1DD] hover:bg-[#15adc7] disabled:opacity-75 text-slate-950 font-black text-base sm:text-lg px-8 py-4 rounded-xl shadow-xl shadow-[#1AC1DD]/25 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 text-slate-950 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Application 🎉</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Zero spam. We respect your privacy and will never share your information.</span>
                  </p>
                </form>

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
                    <div><span className="font-semibold text-slate-900">Business Name:</span> {formData.businessName}</div>
                    <div><span className="font-semibold text-slate-900">Email:</span> {formData.email}</div>
                    <div><span className="font-semibold text-slate-900">Phone:</span> {formData.phone}</div>
                    <div className="sm:col-span-2"><span className="font-semibold text-slate-900">City / Location:</span> {formData.city}</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        city: '',
                        businessName: ''
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

            <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-[#1AC1DD]/10 border border-[#1AC1DD]/25 flex items-center justify-center text-[#1AC1DD] shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-brand-black font-serif tracking-tight">
                  Connect Form with Google Sheets
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-sans mt-0.5">
                  Real-time sync to your Google Spreadsheet via Google Apps Script Web App
                </p>
              </div>
            </div>

            <div className="space-y-6 text-slate-700 text-sm font-sans">
              {/* Web App URL Input */}
              <div className="bg-slate-50/80 border border-slate-200/90 p-5 rounded-2xl space-y-3.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-900 font-sans">
                  Google Apps Script Web App URL <span className="text-[#1AC1DD] font-bold">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input 
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#1AC1DD] focus:ring-4 focus:ring-[#1AC1DD]/10 text-xs sm:text-sm text-slate-900 font-mono transition-all"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveScriptUrl}
                      className="px-5 py-3 bg-[#1AC1DD] hover:bg-[#15adc7] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-[#1AC1DD]/20 transition-all font-sans shrink-0 cursor-pointer"
                    >
                      Save URL
                    </button>
                    <button
                      type="button"
                      onClick={handleTestSubmission}
                      disabled={!inputUrl.trim() || testStatus === 'testing'}
                      className="px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all font-sans shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      {testStatus === 'testing' && <Loader2 className="w-4 h-4 animate-spin text-[#1AC1DD]" />}
                      <span>{testStatus === 'testing' ? 'Testing...' : 'Send Test Lead'}</span>
                    </button>
                  </div>
                </div>

                {inputUrl.trim() && (inputUrl.includes('/dev') || inputUrl.includes('/edit') || !inputUrl.trim().endsWith('/exec')) && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs space-y-1 font-sans">
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
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 font-sans animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Test lead transmitted successfully! Check your Google Sheet to verify the row.</span>
                  </div>
                )}
                {testStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-sans animate-in fade-in">
                    ❌ Failed to reach Google Apps Script. Please verify the URL ends in <code>/exec</code> and "Who has access" is set to <strong>Anyone</strong>.
                  </div>
                )}
              </div>

              {/* Local Submissions Backup Section */}
              <div className="bg-slate-50/80 border border-slate-200/90 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-sans">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-sans">
                    Local Backup Storage ({localLeadsCount} Leads)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-sans">
                    Every lead is also saved in browser storage as a redundant fallback.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={localLeadsCount === 0}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer font-sans"
                >
                  <Download className="w-3.5 h-3.5 text-[#1AC1DD]" />
                  <span>Download CSV ({localLeadsCount})</span>
                </button>
              </div>

              {/* Step by Step Instructions */}
              <div className="space-y-3 font-sans">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 font-sans flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1AC1DD]" />
                  <span>How to connect in Google Sheets (2 minutes)</span>
                </h4>
                
                <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed font-sans">
                  <li>Open your Google Sheet (or create a new blank one).</li>
                  <li>Click <strong>Extensions</strong> → <strong>Apps Script</strong> from the top menu.</li>
                  <li>Clear any existing code in <code>Code.gs</code> and paste the script below:</li>
                </ol>

                {/* Script Code Block */}
                <div className="relative bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-48 border border-slate-800 shadow-inner">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="absolute top-2.5 right-2.5 px-3.5 py-1.5 bg-[#1AC1DD] hover:bg-[#15adc7] text-slate-950 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Apps Script'}</span>
                  </button>
                  <pre className="pr-24">{APPS_SCRIPT_TEMPLATE_CODE}</pre>
                </div>

                <ol start={4} className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed pt-1 font-sans">
                  <li>Click <strong>Deploy</strong> → <strong>New deployment</strong> (top right).</li>
                  <li>Click the ⚙️ gear next to "Select type" and choose <strong>Web app</strong>.</li>
                  <li>
                    Set <strong>Execute as:</strong> <code>Me</code> <br />
                    Set <strong>Who has access:</strong> <code>Anyone</code> (CRITICAL: Must be "Anyone"!)
                  </li>
                  <li>Click <strong>Deploy</strong>, authorize permissions, and copy the <strong>Web App URL</strong> into the field above!</li>
                </ol>
              </div>

              {/* Troubleshooting Tips Box */}
              <div className="bg-[#1AC1DD]/10 border border-[#1AC1DD]/25 text-slate-800 p-4 rounded-2xl text-xs space-y-2 font-sans">
                <h5 className="font-extrabold text-slate-950 flex items-center gap-1.5 font-sans">
                  <span>💡 Sheet still empty after submitting? Check these 2 quick settings:</span>
                </h5>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 leading-relaxed font-sans">
                  <li>
                    <strong>Did you deploy a New Version?</strong> In Google Apps Script, after saving code in <code>Code.gs</code>, you <em>must</em> click <strong>Deploy</strong> → <strong>New deployment</strong> (or <strong>Manage deployments</strong> → ⚙️ Edit → <strong>New version</strong> → Deploy). Saving code alone does NOT update the active Web App!
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
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-colors font-sans cursor-pointer"
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
