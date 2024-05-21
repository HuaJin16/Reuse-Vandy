import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setLogin } = userSlice.actions;

export default userSlice.reducer;
