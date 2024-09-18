import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

// Thunks for async actions
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('https://mern-food-bl34.onrender.com/api/v1/admin/users',{ withCredentials: true } );
  console.log(response.data);
  
  return response.data;
  
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axios.delete(`https://mern-food-bl34.onrender.com/api/v1/admin/users/${id}`,{ withCredentials: true } );
  return id; 
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, updatedUser }) => {
  const response = await axios.put(`https://mern-food-bl34.onrender.com/api/v1/admin/users/${id}`, updatedUser,{ withCredentials: true } );
  return response.data;
});

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
