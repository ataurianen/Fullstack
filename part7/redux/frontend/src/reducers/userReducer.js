import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import storage from '../services/storage';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    removeUser(state, action) {
      return null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

export const userLogIn = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    dispatch(setUser(user));
    storage.saveUser(user);
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch(removeUser());
    storage.removeUser();
  };
};

export const loadUser = () => {
  return async (dispatch) => {
    const user = storage.loadUser();
    if (user) {
      dispatch(setUser(user));
    }
  };
};
