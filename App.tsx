import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ThankYouPage from './components/ThankYouPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'thank-you'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/thank-you' || path === '/thankyou' || hash === '#thank-you' || hash === '#thankyou') {
        return 'thank-you';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/thank-you' || path === '/thankyou' || hash === '#thank-you' || hash === '#thankyou') {
        setCurrentPage('thank-you');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (page: 'home' | 'thank-you') => {
    setCurrentPage(page);
    if (page === 'thank-you') {
      window.history.pushState({}, '', '/thank-you');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'thank-you') {
    return <ThankYouPage onGoHome={() => navigateTo('home')} />;
  }

  return (
    <div className="font-sans bg-white text-brand-black selection:bg-brand-blue selection:text-white">
      <TopBar />
      <main className="relative overflow-hidden">
        <Hero onNavigateToThankYou={() => navigateTo('thank-you')} />
        <TrustedBy />
        <Testimonials />
        <Footer />
      </main>
    </div>
  );
};

export default App;
