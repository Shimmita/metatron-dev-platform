import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  postsTop: null,
};

const CurrentPostsTop = createSlice({
  name: "current_posts_top",
  initialState: initialstate,

  reducers: {
    // update the posts by the feed from the payload
    updateCurrentPostsTop: (state, action) => {
      state.postsTop = action.payload;
    },

    // nullify posts and
    resetClearCurrentPostsTop: (state) => {
      state.postsTop = null;
    },
  },
});

// exporting actions
export const { updateCurrentPostsTop, resetClearCurrentPostsTop } =
  CurrentPostsTop.actions;

// exporting the main fun reducer
export default CurrentPostsTop.reducer;
