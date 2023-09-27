import store from './store/store';

export function useGameState() {
  return store.getState();
}

export function useDispatch() {
  return store.dispatch;
}

