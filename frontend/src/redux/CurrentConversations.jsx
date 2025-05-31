import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  conversations: null,
};

const CurrentConversations = createSlice({
  name: "current_coversations",
  initialState: initialstate,

  reducers: {
    // update the conversations by the feed from the payload
    updateConversations: (state, action) => {
      state.conversations = action.payload;
    },


    // nullify the conversations
    resetClearConversations: (state) => {
      state.conversations = null;
    },
  },
});

// exporting actions
export const {
  updateConversations,
  resetClearConversations,
} = CurrentConversations.actions;

// exporting the main fun reducer
export default CurrentConversations.reducer;
