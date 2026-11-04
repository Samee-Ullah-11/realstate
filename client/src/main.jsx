import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './i18n';
import './styles/index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import site from './config/site';

// Enable the web-font stylesheet (declared media="print" so it never blocks
// the first paint; fonts swap in once loaded).
document.getElementById('webfonts')?.setAttribute('media', 'all');

// The config file holds defaults; admin-edited settings override them.
// The fetch runs in parallel with the first paint instead of blocking it:
// a settled result within the grace window still lands before render, and
// a slow network falls back to file-config defaults with no delay.
const settingsReady = fetch('/api/v1/settings')
  .then((res) => (res.ok ? res.json() : null))
  .then((overrides) => overrides && Object.assign(site, overrides))
  .catch(() => {});

const grace = new Promise((resolve) => setTimeout(resolve, 150));

Promise.race([settingsReady, grace]).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );
});
