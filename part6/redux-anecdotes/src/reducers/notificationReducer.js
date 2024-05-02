/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    displayNotification(state, action) {
      return action.payload;
    },
    hideNotification(state, action) {
      return null;
    },
  },
});

export const setNotification = (message, time) => {
  return async (dispatch) => {
    dispatch(displayNotification(message));

    setTimeout(() => {
      dispatch(hideNotification());
    }, time * 1000);
  };
};

export const { displayNotification, hideNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
