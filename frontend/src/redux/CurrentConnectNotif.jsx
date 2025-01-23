import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  connectNotifications: null,
};

const CurrentConnect = createSlice({
  name: "current_connect_notif",
  initialState: initialstate,

  reducers: {
    // upadate the connect by the feed from the payload
    updateCurrentConnectNotif: (state, action) => {
      state.connectNotifications = action.payload;
    },
    // update the recent change in either of connect
    updateCurrentConnectNotifID: (state, action) => {
      const userIdRemove = action.payload;
      state.connectNotifications = state.connectNotifications.filter(
        (connect) => {
          return connect._id !== userIdRemove;
        }
      );
    },

    // nullify connect
    resetClearCurrentConnectNotif: (state) => {
      state.connectNotifications = null;
    },
  },
});

// exporting actions
export const {
  updateCurrentConnectNotif,
  resetClearCurrentConnectNotif,
  updateCurrentConnectNotifID,
} = CurrentConnect.actions;

// exporting the main fun reducer
export default CurrentConnect.reducer;
