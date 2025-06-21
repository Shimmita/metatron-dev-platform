import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  messageSnackPostTech: null,
  messageSnack: null,
  messageNotification: null,
  messageConnectRequestSent: null,
};

const CurrentSnackBar = createSlice({
  name: "current_snackbar",
  initialState: initialstate,

  reducers: {
    updateCurrentSnackPostSuccess: (state, action) => {
      state.messageSnackPostTech = action.payload;
    },
    // update  user and online status to true
    updateCurrentSnackBar: (state, action) => {
      state.messageSnack = action.payload;
    },

    // update notif message for notifications sections only
    updateNotificationSnackBar: (state, action) => {
      state.messageNotification = action.payload;
    },

    // update message connect request sent
    updateMessageConnectRequest: (state, action) => {
      state.messageConnectRequestSent = action.payload;
    },

    // nullify user and fale online
    resetClearCurrentSnack: (state) => {
      state.messageSnack = null;
      state.messageSnackPostTech = null;
      state.messageNotification = null;
      state.messageConnectRequestSent = null;
    },
  },
});

// exporting actions
export const {
  updateCurrentSnackBar,
  updateCurrentSnackPostSuccess,
  updateNotificationSnackBar,
  resetClearCurrentSnack,
  updateMessageConnectRequest,
} = CurrentSnackBar.actions;

// exporting the main fun reducer
export default CurrentSnackBar.reducer;
