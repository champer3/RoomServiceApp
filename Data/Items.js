import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER_URL } from '../config';

const API_BASE = SERVER_URL;
console.log(SERVER_URL)
const normalizeProduct = (p) => {
  const product = p ?? {};
  return {
    ...product,
    images: Array.isArray(product.images) ? product.images : [],
    description: typeof product.description === "string" ? product.description : "",
    // Keep legacy UI code safe even if backend does not provide these fields.
    options: Array.isArray(product.options) ? product.options : [],
    components: Array.isArray(product.components) ? product.components : [],
    extras: Array.isArray(product.extras) ? product.extras : [],
    subCategory: Array.isArray(product.subCategory) ? product.subCategory : [],
    // Availability defaults to true when missing.
    availability: typeof product.availability === "boolean" ? product.availability : true,
    // Common numeric fallbacks used by cards.
    price: product.price != null ? product.price : 0,
    comparePrice: product.comparePrice != null ? product.comparePrice : null,
    cost: product.cost != null ? product.cost : null,
    stock: product.stock != null ? product.stock : 0,
    lowStockThreshold: product.lowStockThreshold != null ? product.lowStockThreshold : null,
  };
};

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
    removeProduct: (state, action) => {
      state.ids = state.ids.filter(item => item._id !== action.payload);
    },
    patchProduct: (state, action) => {
      const index = state.ids.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.ids[index] = { ...state.ids[index], ...action.payload };
      }
    },
    addProduct: (state, action) => {
      const exists = state.ids.some(item => item._id === action.payload._id);
      if (!exists) {
        state.ids.unshift(action.payload);
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
        state.ids = (Array.isArray(action.payload) ? action.payload : []).map(normalizeProduct);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addReview, removeProduct, patchProduct, addProduct } = items.actions;
export default items.reducer;
