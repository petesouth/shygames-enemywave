import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*
  Game state.  Dind't want to invent the wheel for state and dispatch
  but at same time react was not needed.  All the magic is done in the phaser
  canvas.  Not in HTML/Dom.  So all react would do is re-render the Canvas over and over
  and make the game flicker and play baddly.
*/
const gameSliceInitialState = {
  message: "Welcome to Space Survive. Press Start to play.",
  currentScore: 0,
  enemiesKilled: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState: gameSliceInitialState,
  reducers: {
    incrementScore: (state, action : PayloadAction<{ score: number, killCount: number }>) => {
      state.currentScore += action.payload.score;
      state.enemiesKilled += action.payload.killCount;
    },
  },
});



export const { actions: gameActions, reducer: gameReducer } = gameSlice;
