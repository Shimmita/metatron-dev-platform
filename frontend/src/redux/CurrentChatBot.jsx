import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  isOnline: true,
};

const CurrentChatBot = createSlice({
  name: "current_chatbot_redux",
  initialState: initialstate,

  reducers: {
    // show chat bot
    handleShowChatBot: (state) => {
      state.isOnline = true;
    },

    // close chat bot
    handleCloseChatBot: (state) => {
      state.isOnline = false;
    },
  },
});

// exporting actions
export const { handleShowChatBot, handleCloseChatBot } = CurrentChatBot.actions;

// exporting the main fun reducer
export default CurrentChatBot.reducer;
