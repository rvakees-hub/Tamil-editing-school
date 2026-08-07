import React from 'react';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="font-sans bg-white text-brand-black selection:bg-brand-blue selection:text-white">
      <TopBar />
      <main className="relative overflow-hidden">
        <Hero />
        <TrustedBy />
        <Footer />
      </main>
    </div>
  );
};

export default App;
