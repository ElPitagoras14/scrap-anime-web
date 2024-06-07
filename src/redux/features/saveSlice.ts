import { Saved } from "@/utils/interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SavedState = {
  saved: {
    [key: string]: Saved;
  };
};

const initialState: SavedState = {
  saved: {},
};

export const saveSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {
    saveAnime: (state, action: PayloadAction<Saved>) => {
      const {
        payload: { animeId },
      } = action;
      state.saved = {
        ...state.saved,
        [animeId]: action.payload,
      };
    },
    unsaveAnime: (
      state,
      action: PayloadAction<{
        animeId: string;
      }>
    ) => {
      const { animeId } = action.payload;
      if (state.saved.hasOwnProperty(animeId)) {
        delete state.saved[animeId];
      }
    },
  },
});

export const { saveAnime, unsaveAnime } = saveSlice.actions;

export default saveSlice.reducer;
