import { createSlice } from '@reduxjs/toolkit';

const initialState = 'this is a test';

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    displayNotification(state, action) {
      return action.payload;
    },
  },
});

export default notificationSlice.reducer;
