import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import TrustedBy from './components/TrustedBy';
import Courses from './components/Courses';
import CapCutPage from './components/CapCutPage';
import Footer from './components/Footer';

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
    }
    // Future: Handle other course IDs
  };

  const handleBackToHome = () => {
    setCurrentView('home');
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
          <CapCutPage onBack={handleBackToHome} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;