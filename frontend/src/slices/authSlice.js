import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token ? { token: token, isLoggedIn: true, username: username } :
     { token: null, isLoggedIn: false, username: null };
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
    },
  });
  
export const { actions } = authSlice;
export default authSlice.reducer;