import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '../config';

// Helper function to retrieve token from AsyncStorage
const retrieveTokenFromAsyncStorage = async () => {
  try {
    console.log('Retrieving token...');
    const storedToken = await AsyncStorage.getItem("authToken");
    if (storedToken !== null) {
      return storedToken;
    } else {
      console.log("Token not found in AsyncStorage.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

function serverLineToCartLine(item) {
  const qty = Math.max(1, Number(item.quantity) || 1);
  const products = Array.from({ length: qty }, () => ({
    title: item.productName,
    price: item.unitPrice,
    oldPrice: item.unitPrice,
    images: item.productImageUrl ? [item.productImageUrl] : [''],
    _id: item.productId,
  }));
  const options = (item.variants || []).map((v) => ({
    name: v.groupName,
    values: [{ name: v.choiceName, price: v.priceAdjustment || 0 }],
    required: false,
  }));
  const extra = (item.addons || []).map((a) => ({
    name: a.addonName,
    price: a.unitPrice,
    id: a.addonId,
  }));
  return {
    products,
    options,
    extra,
    instructions: item.notes || '',
  };
}

// Function to transform the order data (new API + legacy)
const transformOrderData = (data) => {
  if (!data || !data.order) {
    console.log('No order data found.');
    return [];
  }

  const orders = data.order;

  const transformedOrders = orders.map((order) => {
    let lines = [];
    if (Array.isArray(order.items) && order.items.length > 0) {
      lines = order.items.map(serverLineToCartLine);
    } else if (Array.isArray(order.orderDetails)) {
      lines = order.orderDetails.map((details) => ({
        extra: (details.sides || []).map((side) =>
          typeof side === 'string' ? JSON.parse(side) : side
        ),
        components: details.component,
        options: (details.flavor || []).map((flavor) =>
          typeof flavor === 'string' ? JSON.parse(flavor) : flavor
        ),
        products: (details.dressing || []).map((dressing) =>
          typeof dressing === 'string' ? JSON.parse(dressing) : dressing
        ),
        instructions: order.notes || order.orderInstruction || '',
      }));
    }

    const addr =
      order.shippingAddress ||
      (order.deliveryAddress && order.deliveryAddress.formattedAddress) ||
      '';

    return {
      id: order._id,
      order: lines,
      date: order.placedAt || order.date,
      status: order.status || order.orderStatus,
      orderType:
        String(order.orderType || 'delivery').toLowerCase() === 'pickup'
          ? 'Pickup'
          : 'Delivery',
      address: addr,
      price: `$${order.totalAmount ?? order.totalPrice ?? 0}`,
      driver: order.driver ?? '',
    };
  });

  return transformedOrders;
};

// Fetch orders with token validation
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching orders...');
      const token = await retrieveTokenFromAsyncStorage();
      console.log("Retrieved Token:", token);
      
      if (!token) {
        console.log("User not logged in, returning empty orders.");
        return [];
      }

      const response = await axios.get(
        `${SERVER_URL}/api/v1/orders/get-your-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Full Response:", response.data);

      return transformOrderData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Redux slice
const order = createSlice({
  name: 'order',
  initialState: {
    ids: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    completeOrder: (state, action) => {
      state.ids.push(action.payload.id);
    },
    updateOrder: (state, action) => {
      const index = state.ids.findIndex(item => item.id === action.payload.id.uid);
      if (index !== -1) {
        const order = state.ids[index];
        const act = action.payload.id.act;
        order[act] = action.payload.id.perform; 
        console.log("Delivery time added successfully:", order);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ids = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const updateOrder = order.actions.updateOrder;
export const completeOrder = order.actions.completeOrder;
export default order.reducer;
