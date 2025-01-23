import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  roles: string[];
  exp: number | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  username: null,
  roles: ['USER'],
  exp: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ isAuthenticated: boolean; token: string; username: string; roles: string[]; exp: number }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.roles = action.payload.roles;
      state.exp = action.payload.exp;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.username = null;
      state.roles = [];
    },
    refreshToken: (state, action: PayloadAction<{ token: string; exp: number }>) => {
      state.token = action.payload.token;
      state.exp = action.payload.exp;
    },
  },
});

export const { login, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
