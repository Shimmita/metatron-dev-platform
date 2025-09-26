import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  isOnline: false,
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

    // reset chat bot
    resetClearChatBot:(state)=>{
      state.isOnline=false
    }
  },
});

// exporting actions
export const { handleShowChatBot, handleCloseChatBot,resetClearChatBot } = CurrentChatBot.actions;

// exporting the main fun reducer
export default CurrentChatBot.reducer;
