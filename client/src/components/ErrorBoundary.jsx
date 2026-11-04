import { Component } from 'react';
import i18n from '../i18n';

// Sits above the router, so navigation isn't available here; the buttons use
// plain location APIs. Uses i18n.t directly (not the hook) because a crash in
// a provider must not take the fallback screen down with it.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    let t = { title: 'Something went wrong', body: 'An unexpected error occurred. Please reload the page or return to the homepage.', reload: 'Reload page', home: 'Go to homepage' };
    try {
      t = {
        title: i18n.t('errorScreen.title'),
        body: i18n.t('errorScreen.body'),
        reload: i18n.t('errorScreen.reload'),
        home: i18n.t('errorScreen.home'),
      };
    } catch {
      // Keep the English fallback if i18n itself is broken.
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <div className="max-w-md text-center">
          <p className="text-6xl font-bold tracking-tight text-accent">500</p>
          <h1 className="mt-3 text-2xl font-semibold text-green">{t.title}</h1>
          <p className="mt-2 text-ink-soft">{t.body}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 font-medium text-white hover:bg-accent-2"
            >
              {t.reload}
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href = '/';
              }}
              className="inline-flex h-11 items-center justify-center rounded-md border border-line bg-white px-5 font-medium text-green hover:bg-paper-2"
            >
              {t.home}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
