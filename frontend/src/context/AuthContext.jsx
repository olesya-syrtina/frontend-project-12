import React, { createContext, useContext, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [username, setUsername] = useState(() => localStorage.getItem('username'));

  const logIn = ({ token: newToken, username: newUsername }) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
  };

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    delete axios.defaults.headers.common.Authorization;
  };

  const isLoggedIn = Boolean(token);

  if (token && !axios.defaults.headers.common.Authorization) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  const value = useMemo(() => ({
    token,
    username,
    logIn,
    logOut,
    isLoggedIn,
  }), [token, username, isLoggedIn]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
