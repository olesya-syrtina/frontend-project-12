import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  return token
    ? { token, isLoggedIn: true, username }
    : { token: null, isLoggedIn: false, username: null };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logIn: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.isLoggedIn = true;
      localStorage.setItem('token', state.token);
      localStorage.setItem('username', state.username);
    },
    logOut: (state) => {
      state.token = null;
      state.username = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
export default authSlice.reducer;
