
import { configureStore } from '@reduxjs/toolkit';
import {gameReducer} from "./gamestore";

const rootReducer = {
  game: gameReducer
};

const gGameStore = configureStore({
  reducer: rootReducer,
});


export default gGameStore;
