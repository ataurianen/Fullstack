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

export const setNotification = (message, type) => {
  return async (dispatch) => {
    dispatch(displayNotification(message, type));

    setTimeout(() => {
      dispatch(hideNotification());
    }, 5000);
  };
};

export const { displayNotification, hideNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
