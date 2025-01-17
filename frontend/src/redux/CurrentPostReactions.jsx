import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  post_reactions: [],
};

const CurrentPostReactions = createSlice({
  name: "current_post_reactions",
  initialState: initialstate,

  reducers: {
    // upadate the post_reactions by the feed from the payload
    updateCurrentPostReactions: (state, action) => {
      state.post_reactions = action.payload;
    },

    // delete a reaction
    deleteCurrentPostReaction: (state, action) => {
      // getting passed payload
      const currentReaction = action.payload;
      // use filter to return new array that has not the passed payload based on ID
      state.post_reactions = state.post_reactions.filter(
        (reaction) => reaction._id !== currentReaction._id
      );
    },

    // nullify job and
    resetClearCurrentPostReactions: (state) => {
      state.post_reactions = null;
    },
  },
});

// exporting actions
export const {
  updateCurrentPostReactions,
  resetClearCurrentPostReactions,
  deleteCurrentPostReaction,
} = CurrentPostReactions.actions;

// exporting the main fun reducer
export default CurrentPostReactions.reducer;
