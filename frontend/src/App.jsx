import { useEffect } from 'react';
import leoProfanity from 'leo-profanity';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import LoginPage from './components/LoginPage.jsx';
import HomePage from './components/HomePage.jsx';
import SignupPage from './components/SignupPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useEffect(() => {
    const ruDict = leoProfanity.getDictionary('ru');
    leoProfanity.add(ruDict);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </BrowserRouter>
  );
};

export default App;
