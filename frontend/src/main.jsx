import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { I18nextProvider } from 'react-i18next';
import initI18n from './i18next';
import { SocketProvider } from './socketContext';
import store from './slices';
import App from './App.jsx';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN || '',
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const Root = () => {
  const [i18nInstance, setI18nInstance] = useState(null);

  useEffect(() => {
    initI18n().then(setI18nInstance);
  }, []);

  if (!i18nInstance) return null;

  return (
    <StrictMode>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <ReduxProvider store={store}>
            <I18nextProvider i18n={i18nInstance}>
              <SocketProvider>
                <App />
              </SocketProvider>
            </I18nextProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Root />);
