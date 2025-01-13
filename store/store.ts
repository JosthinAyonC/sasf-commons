import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authSlice from './slices/authSlice';

// https://hernandezmarquina.medium.com/crea-un-estado-persistente-con-redux-persist-redux-toolkit-en-react-native-4b1a7f0b5059
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  // Add your reducers here
  auth: authSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
