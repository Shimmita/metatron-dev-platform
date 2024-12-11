import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  posts: null,
};

const currentPosts = createSlice({
  name: "current_posts",
  initialState: initialstate,

  reducers: {
    // upadte  user and online status to true
    updateCurrentPosts: (state, action) => {
      state.posts = action.payload;
    },

    // nullify user and fale online
    resetClearCurrentPosts: (state) => {
      state.posts = null;
    },
  },
});

// exporting actions
export const { updateCurrentPosts, resetClearCurrentPosts } =
  currentPosts.actions;

// exporting the main fun reducer
export default currentPosts.reducer;
