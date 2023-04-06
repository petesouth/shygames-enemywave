import { configureStore } from '@reduxjs/toolkit';
import { gamesSlice } from "./gameAPI";

export const store = configureStore({
  reducer: {
    games: gamesSlice.reducer,
  },
});
