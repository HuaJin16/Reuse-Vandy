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
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
    deleteUser: (state) => {
      state.currentUser = null;
    },
    logoutUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setLogin, updateUser, deleteUser, logoutUser } =
  userSlice.actions;

export default userSlice.reducer;
