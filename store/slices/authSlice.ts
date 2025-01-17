import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  roles: string[];
};

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  username: null,
  roles: ['USER'],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ isAuthenticated: boolean; token: string; username: string; roles: string[] }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.roles = action.payload.roles;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.username = null;
      state.roles = [];
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
