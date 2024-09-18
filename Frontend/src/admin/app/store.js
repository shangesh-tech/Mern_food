import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice'; 

const store = configureStore({
  reducer: {
    products: productReducer,
    users: userReducer,
    orders: orderReducer, 
  },
});

export default store;
