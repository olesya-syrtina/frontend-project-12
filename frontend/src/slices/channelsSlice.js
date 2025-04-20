/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { getState, rejectWithValue }) => {
    const { token } = getState().authorization;
    try {
      const response = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка получения каналов');
    }
  },
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    status: 'idle',
    error: null,
    currentChannelId: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    updateChannel: (state, action) => {
      const index = state.channels.findIndex((ch) => ch.id === action.payload.id);
      if (index !== -1) {
        state.channels[index] = action.payload;
      }
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter((ch) => ch.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels = action.payload;
        if (!state.currentChannelId) {
          const generalChannel = state.channels.find(
            (ch) => ch.name === 'general',
          );

          if (generalChannel) {
            state.currentChannelId = generalChannel.id;
          } else if (state.channels.length > 0) {
            state.currentChannelId = state.channels[0].id;
          }
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentChannel, addChannel, updateChannel, removeChannel,
} = channelsSlice.actions;
export default channelsSlice.reducer;
