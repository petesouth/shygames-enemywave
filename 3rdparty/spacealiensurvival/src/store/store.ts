
import { configureStore } from '@reduxjs/toolkit';
import {gameReducer} from "./gamestore";

const rootReducer = {
  game: gameReducer
};

const store = configureStore({
  reducer: rootReducer,
});


export default store;
