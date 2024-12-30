import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  posts: [],
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
      state.posts = [];
    },
  },
});

// exporting actions
export const { updateCurrentPosts, resetClearCurrentPosts } =
  currentPosts.actions;

// exporting the main fun reducer
export default currentPosts.reducer;
