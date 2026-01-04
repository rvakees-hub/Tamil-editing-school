import React, { useEffect, useState, Suspense } from 'react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import TrustedBy from './components/TrustedBy';
import Courses from './components/Courses';
import Footer from './components/Footer';

// Lazy load the CapCut page to reduce initial bundle size
const CapCutPage = React.lazy(() => import('./components/CapCutPage'));

// Loading fallback for the lazy component
const PageLoader = () => (
  <div className="min-h-screen bg-brand-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-white/10 border-t-brand-blue rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm font-mono animate-pulse">Loading Course Data...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  // Initialize state based on current URL to ensure immediate rendering of the correct page
  const [currentView, setCurrentView] = useState<'home' | 'capcut'>(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);

      if (
        hostname.startsWith('capcut.') ||
        pathname === '/capcut' ||
        hash === '#capcut' ||
        params.get('page') === 'capcut'
      ) {
        return 'capcut';
      }
    }
    return 'home';
  });

  // Lifted modal state to App level so Footer can trigger it
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleRouting = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      const hash = window.location.hash;
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;

      if (
        pathname === '/capcut' ||
        pageParam === 'capcut' || 
        hash === '#capcut' || 
        hostname.startsWith('capcut.')
      ) {
        setCurrentView('capcut');
      } else {
        // Only revert to home if NOT on the subdomain
        if (!hostname.startsWith('capcut.')) {
           setCurrentView('home');
        }
      }
    };

    // Run on back/forward button
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  // Helper to update URL without page reload
  const updateUrl = (view: 'home' | 'capcut') => {
    if (view === 'capcut') {
       // Don't push state if we are already on the subdomain, it handles itself
       if (!window.location.hostname.startsWith('capcut.')) {
          window.history.pushState({}, '', '/capcut');
       }
    } else {
       if (!window.location.hostname.startsWith('capcut.')) {
          window.history.pushState({}, '', '/');
       }
    }
  };

  const handleCourseSelection = (courseId: string) => {
    if (courseId === 'capcut') {
      setCurrentView('capcut');
      updateUrl('capcut');
      window.scrollTo(0, 0);
    }
    // Future: Handle other course IDs
  };

  const handleBackToHome = () => {
    // If we are on the subdomain, "Back" should take us to the main domain
    if (window.location.hostname.startsWith('capcut.')) {
        const mainDomain = window.location.hostname.replace('capcut.', '');
        const protocol = window.location.protocol;
        // Handle local development case where replace results in empty string if host is just 'capcut.localhost' etc
        const target = mainDomain || 'tamileditingschool.com';
        
        window.location.href = `${protocol}//${target}`;
        return;
    }

    setCurrentView('home');
    setIsModalOpen(false);
    updateUrl('home');
    window.scrollTo(0, 0);
  };

  const handleFooterEnroll = () => {
    setCurrentView('capcut');
    setIsModalOpen(true);
    updateUrl('capcut');
    window.scrollTo(0, 0);
  };

  return (
    <div className="font-sans bg-brand-black text-white selection:bg-brand-blue selection:text-white">
      <main className="relative overflow-hidden">
        {currentView === 'home' ? (
          <>
            <Hero />
            <TrustedBy />
            <Courses onSelectCourse={handleCourseSelection} />
            <HowItWorks />
          </>
        ) : (
          <Suspense fallback={<PageLoader />}>
            <CapCutPage 
              onBack={handleBackToHome} 
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </Suspense>
        )}
      </main>
      <Footer onEnroll={handleFooterEnroll} />
    </div>
  );
};

export default App;