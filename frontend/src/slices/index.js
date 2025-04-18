import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.js';
import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';

 export default configureStore({
   reducer: {
    authorization: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
   }
 })