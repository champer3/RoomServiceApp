import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk('items/fetchProducts', async () => {
  try {
    const response = await axios.get(
      `https://afternoon-waters-32871-fdb986d57f83.herokuapp.com/api/v1/products`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.products;
  } catch (err) {
    console.log(err);
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
        state.ids = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
console.log('here')

export const { addReview } = items.actions;
export default items.reducer;
