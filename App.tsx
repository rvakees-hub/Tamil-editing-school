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
  // Simple state-based routing
  const [currentView, setCurrentView] = useState<'home' | 'capcut'>('home');

  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const handleCourseSelection = (courseId: string) => {
    if (courseId === 'capcut') {
      setCurrentView('capcut');
      window.scrollTo(0, 0);
    }
    // Future: Handle other course IDs
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  return (
    <div className="font-sans bg-brand-black text-white selection:bg-brand-blue selection:text-white">
      <main className="relative overflow-hidden">
        {currentView === 'home' ? (
          <>
            <Hero />
            <Courses onSelectCourse={handleCourseSelection} />
            <TrustedBy />
            <HowItWorks />
          </>
        ) : (
          <Suspense fallback={<PageLoader />}>
            <CapCutPage onBack={handleBackToHome} />
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;