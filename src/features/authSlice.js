
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ""
}

export const LoginUser = createAsyncThunk("user/LoginUser", async(user, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: user.email,
      password: user.password
    });
    return response.data;
    
  } catch (error) {
    if(error.response){
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
  }s
});

export const RegisterUser = createAsyncThunk("user/RegisterUser", async(user, thunkAPI) => {
  try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role
      });
      return response.data;
  } catch (error) {
      if(error.response){
          const message = error.response.data.msg;
          return thunkAPI.rejectWithValue(message);
      }
  }
});

export const getUserDetail = createAsyncThunk("user/getUserDetail", async(_, thunkAPI) => {
  try {
    const response = await axios.get('http://localhost:3000/me');
    return response.data;
    
  } catch (error) {
    if(error.response){
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
    
  }
});

export const LogOut = createAsyncThunk("user/Logout", async() => {
  await axios.delete('http://localhost:3000/logout');
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {

    //login
    builder.addCase(LoginUser.pending, (state) =>{
      state.isLoading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state,action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload.user;
      state.token = action.payload.token; 
    });
    builder.addCase(LoginUser.rejected, (state,action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    

  // Register
      builder.addCase(RegisterUser.pending, (state) =>{
          state.isLoading = true;
      });
      builder.addCase(RegisterUser.fulfilled, (state, action) =>{
          state.isLoading = false;
          state.isSuccess = true;
          state.message = action.payload.msg;
      });
      builder.addCase(RegisterUser.rejected, (state, action) =>{
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      });

    // Get user login
    builder.addCase(getUserDetail.pending, (state) =>{
      state.isLoading = true;
    });
    builder.addCase(getUserDetail.fulfilled, (state,action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(getUserDetail.rejected, (state,action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

  }
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;
