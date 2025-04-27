import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/messages')
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка получения сообщений')
    }
  },
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      const newMsg = action.payload
      const exists = state.messages.some((m) => {
        if (m.id && newMsg.id && m.id === newMsg.id) return true
        if (m.tempId && newMsg.tempId && m.tempId === newMsg.tempId) return true
        if (
          ((m.optimistic && !newMsg.optimistic)
            || (newMsg.optimistic && !m.optimistic))
          && m.body === newMsg.body
          && m.username === newMsg.username
          && m.channelId === newMsg.channelId
        ) {
          return true
        }
        return false
      })
      if (!exists) {
        state.messages.push(newMsg)
      }
    },
    confirmMessage: (state, action) => {
      const { tempId, message } = action.payload
      const index = state.messages.findIndex(m => m.tempId === tempId)
      if (index !== -1) {
        state.messages[index] = message
      }
      else {
        const exists = state.messages.some(m => m.id === message.id)
        if (!exists) state.messages.push(message)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { addMessage, confirmMessage } = messagesSlice.actions

export const selectMessagesForCurrent = (state) => {
  const cid = state.channels.currentChannelId
  return state.messages.messages.filter(m => m.channelId === cid)
}

export default messagesSlice.reducer
