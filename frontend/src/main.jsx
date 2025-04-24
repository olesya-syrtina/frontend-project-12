import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import Rollbar from 'rollbar';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import initI18n from './i18next';
import { SocketProvider } from './socketContext';
import store from './slices';
import App from './App.jsx';

const rollbar = new Rollbar({
  accessToken: 'a85dea5dcfd8417996898075f756209c876169ff5925606768fe7a794b5446da53e33396fae75abe497962fe65ad564d',
  environment: 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const Root = () => {
  const [i18nInstance, setI18nInstance] = useState(null);

  useEffect(() => {
    initI18n().then(setI18nInstance);
  }, []);

  if (!i18nInstance) return null;

  return (
    <StrictMode>
      <RollbarProvider instance={rollbar}>
        <ErrorBoundary>
          <Provider store={store}>
            <I18nextProvider i18n={i18nInstance}>
              <SocketProvider>
                <App />
              </SocketProvider>
            </I18nextProvider>
          </Provider>
        </ErrorBoundary>
      </RollbarProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Root />);
