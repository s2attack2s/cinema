import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "app",
  initialState: {
    enums: [],
  },
  reducers: {
    getIncrementSuccess: (state, action) => {
      console.log("456");
    },
    getDecrementSuccess: (state, action) => {
      console.log("123");
    },
  },
});

export const actions = slice.actions;

export default slice.reducer;
