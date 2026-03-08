import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER_URL } from '../config';

const API_BASE = SERVER_URL;

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk('items/fetchProducts', async () => {
  try {
    const response = await axios.get(
      `${API_BASE}/api/v1/products`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );
    const products = response?.data?.data?.products;
    const list = Array.isArray(products) ? products : [];
    if (list.length === 0 && products != null) {
      console.warn('Products response was not an array:', products);
    }
    return list;
  } catch (err) {
    console.warn('Fetch products failed:', err?.message || err);
    throw err;
  }
});

const items = createSlice({
  name: 'items',
  initialState: {
    ids: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addReview: (state, action) => {
      const index = state.ids.findIndex(item => item.title === action.payload.id.title);
      if (index !== -1) {
        state.ids[index].reviews.push(action.payload.id.reviews);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ids = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addReview } = items.actions;
export default items.reducer;
