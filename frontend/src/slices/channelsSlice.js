import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/channels')
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка получения каналов')
    }
  },
)

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
      state.currentChannelId = action.payload
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload)
    },
    updateChannel: (state, action) => {
      const index = state.channels.findIndex(ch => ch.id === action.payload.id)
      if (index !== -1) {
        state.channels[index] = action.payload
      }
    },
    removeChannel: (state, action) => {
      const removedId = action.payload
      state.channels = state.channels.filter(c => c.id !== removedId)
      if (state.currentChannelId === removedId) {
        const general = state.channels.find(c => c.name === 'general')
        state.currentChannelId = general
          ? general.id
          : (state.channels[0] && state.channels[0].id)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.channels = action.payload
        if (!state.currentChannelId) {
          const general = state.channels.find(c => c.name === 'general')
          state.currentChannelId = general
            ? general.id
            : (state.channels[0] && state.channels[0].id)
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const {
  setCurrentChannel, addChannel, updateChannel, removeChannel,
} = channelsSlice.actions

export default channelsSlice.reducer
