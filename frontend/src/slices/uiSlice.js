import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: { modal: null, modalProps: {} },
  reducers: {
    openModal(state, { payload: { type, props } }) {
      state.modal = type;
      state.modalProps = props || {};
    },
    closeModal(state) {
      state.modal = null;
      state.modalProps = {};
    },
  },
});

export const { openModal, closeModal } = slice.actions;
export default slice.reducer;
