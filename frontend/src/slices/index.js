import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.js';
import channelsReducer from './channelsSlice.js';
 
 export default configureStore({
   reducer: {
    authorization: authReducer,
    channels: channelsReducer,
   }
 })