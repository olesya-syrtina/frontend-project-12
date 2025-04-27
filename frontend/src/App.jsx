import React, { useEffect, useState } from 'react';
import leoProfanity from 'leo-profanity';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { I18nextProvider } from 'react-i18next';
import { io } from 'socket.io-client';
import { AuthProvider } from './context/AuthContext.jsx';
import { addMessage } from './slices/messagesSlice.js';
import { addChannel, removeChannel, updateChannel as renameChannel } from './slices/channelsSlice.js';
import store from './slices/index.js';
import initI18n from './i18next.js';
import PATHS from './routes.js';

import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import SignupPage from './components/SignupPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import ModalContainer from './components/ModalContainer.jsx';

import 'react-toastify/dist/ReactToastify.css';

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN || '',
  environment: import.meta.env.MODE || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const App = () => {
  const [i18nInstance, setI18nInstance] = useState(null);

  useEffect(() => {
    initI18n().then(setI18nInstance);
    const ruDict = leoProfanity.getDictionary('ru');
    leoProfanity.add(ruDict);
  }, []);

  useEffect(() => {
    if (!i18nInstance) return undefined;
    const socket = io();

    socket.on('newMessage', (msg) => store.dispatch(addMessage(msg)));
    socket.on('newChannel', (ch) => {
      store.dispatch(addChannel(ch));
    });
    socket.on('removeChannel', ({ id }) => {
      store.dispatch(removeChannel(id));
    });
    socket.on('renameChannel', (ch) => {
      store.dispatch(renameChannel(ch));
    });
    socket.on('connect_error', () => {
      toast.error(i18nInstance.t('toast.networkError'));
    });

    return () => { socket.disconnect(); };
  }, [i18nInstance]);

  if (!i18nInstance) return null;

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <I18nextProvider i18n={i18nInstance}>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path={PATHS.HOME} element={<HomePage />} />
                  <Route path={PATHS.LOGIN} element={<LoginPage />} />
                  <Route path={PATHS.SIGNUP} element={<SignupPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  pauseOnHover
                />
                <ModalContainer />
              </BrowserRouter>
            </AuthProvider>
          </I18nextProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

createRoot(document.getElementById('root')).render(<App />);

export default App;
