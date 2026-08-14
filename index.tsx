import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress harmless browser ResizeObserver loop and network/fetch telemetry errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    const msg = e.message ? String(e.message) : '';
    if (
      msg.includes('ResizeObserver loop') ||
      msg.includes('ResizeObserver') ||
      msg.includes('Failed to fetch') ||
      msg.includes('NetworkError') ||
      msg.includes('Load failed') ||
      msg.includes('Script error')
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason ? String(e.reason?.message || e.reason) : '';
    if (
      reason.includes('Failed to fetch') ||
      reason.includes('NetworkError') ||
      reason.includes('Load failed') ||
      reason.includes('ResizeObserver') ||
      reason.includes('aborted')
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
