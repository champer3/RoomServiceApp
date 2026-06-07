import { createSlice } from '@reduxjs/toolkit';
import { syncFavoritesToServer } from '../api/syncService';

let syncTimer = null;
function debouncedFavSync(getState) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const ids = getState().favorites.ids;
    syncFavoritesToServer(ids).catch(() => {});
  }, 1500);
}

export const favorites = createSlice({
  name: 'favorites',
  initialState: {
    ids: [],
  },
  reducers: {
    setFavorites: (state, action) => {
      state.ids = action.payload || [];
    },
    toggleFavorite: (state, action) => {
      const productId = action.payload;
      const index = state.ids.indexOf(productId);
      if (index === -1) {
        state.ids.push(productId);
      } else {
        state.ids.splice(index, 1);
      }
    },
    removeFavorite: (state, action) => {
      state.ids = state.ids.filter(id => id !== action.payload);
    },
    resetFavorites: (state) => {
      state.ids = [];
    },
  },
});

export const { setFavorites, toggleFavorite, removeFavorite, resetFavorites } = favorites.actions;

export const favSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type === 'favorites/toggleFavorite' || action.type === 'favorites/removeFavorite') {
    debouncedFavSync(store.getState);
  }
  return result;
};

export default favorites.reducer;
