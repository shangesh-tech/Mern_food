import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  ordersList: [],
  totalAmount: 0,
  isLoading: false,
  error: '',
};

const BASE_URL = 'https://mern-food-bl34.onrender.com/api/v1';

// GET all orders
export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (timeframe, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/orders`, {
        params: { timeframe }, // Pass timeframe as a query param if applicable
      },{ withCredentials: true } );
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'No Orders Found' });
    }
  }
);

// POST a new order
export const addOrder = createAsyncThunk(
  'orders/addOrder',
  async (order, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/order/new`, order,{ withCredentials: true } );
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'Order Not Added' });
    }
  }
);

// PUT (update) an order
export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (order, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/order/${order._id}`, order,{ withCredentials: true } );
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: 'Order Not Updated' });
    }
  }
);

// DELETE an order
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/admin/order/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue({ error: 'Order Not Deleted' });
    }
  }
);

const ordersSlice = createSlice({
  name: 'ordersSlice',
  initialState,
  reducers: {
    // Custom reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle GET orders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = '';
        state.ordersList = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
        state.ordersList = [];
      })

      // Handle POST order
      .addCase(addOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = '';
        state.ordersList.push(action.payload);
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      })

      // Handle PUT (update) order
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = '';
        state.ordersList = state.ordersList.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      })

      // Handle DELETE order
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = '';
        state.ordersList = state.ordersList.filter(
          (order) => order._id !== action.payload
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      });
  },
});

export default ordersSlice.reducer;
