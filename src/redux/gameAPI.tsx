import { createSlice, createAction, AsyncThunk, AnyAction, createAsyncThunk } from '@reduxjs/toolkit';


export interface Game {
  id: number,
  title: string,
  description: string,
  gameImage: string,
  url: string,
  width: string|number,
  height: string|number
}

export interface GamesPayload {
  gameList: Game[]
}


export interface GameFeedState {
  gameList: Game[]
}

export const initialGameFeedState: GameFeedState = {
  gameList: []
}


const hardcodedGameList = [
  { id: 1,
    title: "Space Alient Survivor",
    description: "Come play this amazing space alient battle!!!  Watch your ship grow more and more powerful as each wave of enemies gain in number and abilities",
    gameImage: "https://petesouth.github.io/shyhumangames-gamefeed/spacealiensurvival/images/gamescreen.png",
    url: "https://petesouth.github.io/shyhumangames-gamefeed/spacealiensurvival/index.html",
    width: 800,
    height: 600    
  }
];

// Fetch
export const fetchGames = createAsyncThunk('games/fetchUsers', async () => {
  //const response = await fetch('/api/games');
  //const data = await response.json();
  const data: any = {
    gameList: hardcodedGameList 
  };
  return data;
});


// Create the reducers
export const gamesSlice = createSlice({
  name: 'games',
  initialState: initialGameFeedState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGames.fulfilled, (state, action) => {
      state.gameList = action.payload.gameList;
    });
  },
});
