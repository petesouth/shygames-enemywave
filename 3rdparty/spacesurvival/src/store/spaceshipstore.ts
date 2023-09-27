import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const spaceshipInitialState = {
  x: 400, // Initial x position (middle of the screen)
  y: 300, // Initial y position (middle of the screen)
  rotation: 0, // Initial rotation (in radians)
};

const spaceshipSlice = createSlice({
  name: 'spaceship',
  initialState: spaceshipInitialState,
  reducers: {
    updatePosition: (state, action : PayloadAction<{ x: number, y: number }>) => {
      state.x = action.payload.x;
      state.y = action.payload.y;
    },
    updateRotation: (state, action : PayloadAction<{ rotation: number }>) => {
      state.rotation = action.payload.rotation;
    },
  },
});

export const { actions: spaceshipActions, reducer: spaceshipReducer } = spaceshipSlice;
