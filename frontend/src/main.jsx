import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18next';
import store from './slices/index.js';
import Rollbar from 'rollbar';
import { Provider as RollbarProvider, ErrorBoundary, useRollbar } from '@rollbar/react';

const rollbarConfig = {
  accessToken: 'a85dea5dcfd8417996898075f756209c876169ff5925606768fe7a794b5446da53e33396fae75abe497962fe65ad564d',
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const rollbar = new Rollbar(rollbarConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>,
);
