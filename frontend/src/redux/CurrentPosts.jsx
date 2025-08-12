import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  posts: [],
  isPostSearch: false,
};

const currentPosts = createSlice({
  name: "current_posts",
  initialState: initialstate,

  reducers: {
    // update  user and online status to true
    updateCurrentPosts: (state, action) => {
      state.posts =action.payload;
    },

    // update current posts from global search results that they be on top of
    // existing posts.
    updateCurrentPostsFromSearch: (state, action) => {
      // update is postSearch to true for tracking searched posts and restoring states
      state.isPostSearch = true;
      // don't add posts that already exist in redux using set
      state.posts = action.payload;
    },

    // update specific post i.e likes,comments or when are changes
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

    
    // nullify user and false online
    resetClearCurrentPosts: (state) => {
      state.posts = [];
      state.isPostSearch = false;
    },
  },
});

// exporting actions
export const {
  updateCurrentPosts,
  resetClearCurrentPosts,
  updateCurrentPostDetails,
  updateCurrentPostsFromSearch,
} = currentPosts.actions;

// exporting the main fun reducer
export default currentPosts.reducer;
