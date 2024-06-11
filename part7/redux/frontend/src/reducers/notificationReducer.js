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

export const setNotification = (notification) => {
  return async (dispatch) => {
    dispatch(displayNotification(notification));

    setTimeout(() => {
      dispatch(hideNotification());
    }, notification.time * 1000);
  };
};

export const { displayNotification, hideNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
