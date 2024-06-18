import { Download } from "@/utils/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DownloadState = {
  queue: Download[];
  downloading: Download[];
  history: Download[];
};

const initialState: DownloadState = {
  queue: [],
  downloading: [],
  history: [],
};

export const downloadSlice = createSlice({
  name: "download",
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<Download>) => {
      state.queue.push(action.payload);
    },
    startDownload: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.queue.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.downloading.push(state.queue[index]);
        state.queue.splice(index, 1);
      }
    },
    updateDownload: (
      state,
      action: PayloadAction<{ id: string; progress: number; total: number }>
    ) => {
      const index = state.downloading.findIndex(
        (d) => d.id === action.payload.id
      );
      if (index !== -1) {
        state.downloading[index].progress = action.payload.progress;
        state.downloading[index].totalSize = action.payload.total;
      }
    },
    finishDownload: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.downloading.findIndex(
        (d) => d.id === action.payload.id
      );
      if (index !== -1) {
        state.history.push(state.downloading[index]);
        state.downloading.splice(index, 1);
      }
    },
    cancelDownload: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.downloading.findIndex(
        (d) => d.id === action.payload.id
      );
      if (index !== -1) {
        state.downloading.splice(index, 1);
      }
    },
    quitFromQueue: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.queue.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.queue.splice(index, 1);
      }
    },
    quitFromHistory: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.history.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.history.splice(index, 1);
      }
    },
  },
});

export const {
  addToQueue,
  startDownload,
  updateDownload,
  finishDownload,
  cancelDownload,
  quitFromQueue,
  quitFromHistory,
} = downloadSlice.actions;

export default downloadSlice.reducer;
