import store from './store';

export function useGameState() {
  return {
    dispatch: store.dispatch,
    state: store.getState()
  }
}


