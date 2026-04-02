import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Persist user
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Clear user storage
      
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
