import gGameStore from './store';

export function useGameState() {
  return {
    dispatch: gGameStore.dispatch,
    state: gGameStore.getState()
  }
}


