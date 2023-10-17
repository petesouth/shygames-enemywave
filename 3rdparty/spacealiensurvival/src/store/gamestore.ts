import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/*
  Game state.  Dind't want to invent the wheel for state and dispatch
  but at same time react was not needed.  All the magic is done in the phaser
  canvas.  Not in HTML/Dom.  So all react would do is re-render the Canvas over and over
  and make the game flicker and play baddly.
*/
const gameSliceInitialState = {
  message: "Welcome to Space Survive. Press Start to play.",
  playerSpaceShipKilled: 0,
  enemiesKilled: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState: gameSliceInitialState,
  reducers: {
    incrementPlayersScore: (state, action : PayloadAction<{ }>) => {
      state.playerSpaceShipKilled += 1;
    },
    incrementEnemiesScore: (state, action : PayloadAction<{  }>) => {
      state.enemiesKilled += 1;
    },
  },
});



export const { actions: gameActions, reducer: gameReducer } = gameSlice;
