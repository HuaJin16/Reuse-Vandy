import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  savedPosts: [],
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
    addSavedPost: (state, action) => {
      state.savedPosts.push(action.payload);
    },
    removeSavedPost: (state, action) => {
      state.savedPosts = state.savedPosts.filter(
        (post) => post._id !== action.payload
      );
    },
    clearSavedPosts: (state) => {
      state.savedPosts = [];
    },
  },
});

export const {
  setLogin,
  updateUser,
  deleteUser,
  logoutUser,
  addSavedPost,
  removeSavedPost,
  clearSavedPosts,
} = userSlice.actions;

export default userSlice.reducer;
