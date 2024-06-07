// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import downloadReducer from "./features/downloadSlice";
import savedReducer from "./features/saveSlice";

const persistDownloadConfig = {
  key: "download",
  storage,
};
const persistDownloadReducer = persistReducer(
  persistDownloadConfig,
  downloadReducer
);

const persistSaveConfig = {
  key: "save",
  storage,
};
const persistSaveReducer = persistReducer(persistSaveConfig, savedReducer);

export const store = configureStore({
  reducer: {
    downloadReducer: persistDownloadReducer,
    saveReducer: persistSaveReducer
  },
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
