
import { configureStore } from '@reduxjs/toolkit';
import {gameReducer} from "./gamestore";
import {spaceshipReducer} from "./spaceshipstore";

const rootReducer = {
  game: gameReducer,
  spaceship: spaceshipReducer,
};

const store = configureStore({
  reducer: rootReducer,
});


export default store;
