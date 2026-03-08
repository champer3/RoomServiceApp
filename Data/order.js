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

// Function to transform the order data
const transformOrderData = (data) => {
  if (!data || !data.order) {
    console.log('No order data found.');
    return [];
  }

  const orders = data.order;

  const transformedOrders = orders.map((order) => {
    return {
      id: order._id, // Order ID
      order: order.orderDetails.map((details) => ({
        extra: details.sides.map((side) => JSON.parse(side)), // Parse stringified sides
        components: details.component, // From components
        options: details.flavor.map((flavor) => JSON.parse(flavor)), // Parse stringified flavor options
        products: details.dressing.map((dressing) => JSON.parse(dressing)), // Parse stringified dressing products
        instructions: order.orderInstruction || "", // Order instructions
      })),
      date: order.date, // Date of the order
      status: order.orderStatus, // Order status
      address: order.shippingAddress, // Shipping address
      price: `$${order.totalPrice}`, // Price in the format "$<totalPrice>"
      driver: order.driver ?? '', // Driver information
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
      console.log("Retrieved Token:", token); // Check if the token is retrieved correctly
      
      if (!token) {
        console.log("User not logged in, returning empty orders.");
        return [];
      }

      // Fetch the orders if the token is available
      const response = await axios.get(
        `${SERVER_URL}/api/v1/orders/get-your-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log the full response for debugging
      console.log("Full Response:", response.data);

      return transformOrderData(response.data.data); // Assuming the orders are in response.data.data
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
      const index = state.ids.findIndex(item => item.id === action.payload.id.uid); // Find the object with the given id
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
        state.ids = action.payload; // Update the order array with fetched orders or an empty array
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
