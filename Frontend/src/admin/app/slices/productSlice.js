import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  productsList: [],
  isLoading: false,
  error: "",
};
const BASE_URL = "https://mern-food-bl34.onrender.com/api/v1";

// GET all products
export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/products`,{ withCredentials: true } );
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: "No Products Found" });
    }
  }
);

// POST a new product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/product/new`, product,{ withCredentials: true } );
      return response.data;
    } catch (error) {
      return rejectWithValue({ error: "Product Not Added" });
    }
  }
);


const productsSlice = createSlice({
  name: "productsSlice",
  initialState,
  reducers: {
    removeProductFromList: (state, action) => {
      state.productsList = state.productsList.filter(
        (product) => product._id !== action.payload._id
      );
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestionList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.productsList = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.error = action.payload.error;
        state.isLoading = false;
        state.productsList = [];
      })
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        if (Array.isArray(state.productsList)) {
          state.productsList.push(action.payload);
        } else {
          state.productsList = [action.payload];  
        }
      })
      
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload.error;
        state.isLoading = false;
      })
  },
});

export const { removeProductFromList, setSelectedProduct, clearSuggestions  } =
  productsSlice.actions;

export default productsSlice.reducer;
