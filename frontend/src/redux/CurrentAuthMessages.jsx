import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  authMessage: "",
};

const CurrentAuthMessages = createSlice({
  name: "current_auth_message",
  initialState: initialstate,

  reducers: {
    // update  user and online status to true
    updateCurrentAuthMessage: (state, action) => {
      state.authMessage = action.payload;
    },

    // nullify user and false online
    resetClearCurrentAuthMessage: (state) => {
      state.authMessage = null;
    },
  },
});

// exporting actions
export const { updateCurrentAuthMessage, resetClearCurrentAuthMessage } =
  CurrentAuthMessages.actions;

// exporting the main fun reducer
export default CurrentAuthMessages.reducer;
