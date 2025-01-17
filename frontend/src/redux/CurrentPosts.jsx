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
    // update specific post i.e likes,comments etc
    updateCurrentPostDetails: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex(
        (post) => post._id === updatedPost._id
      );
      // post present
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...updatedPost };
      }
    },

    // nullify user and fale online
    resetClearCurrentPosts: (state) => {
      state.posts = [];
    },
  },
});

// exporting actions
export const {
  updateCurrentPosts,
  resetClearCurrentPosts,
  updateCurrentPostDetails,
} = currentPosts.actions;

// exporting the main fun reducer
export default currentPosts.reducer;
