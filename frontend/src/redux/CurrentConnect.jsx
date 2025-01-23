import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  connectTop: null,
};

const CurrentConnect = createSlice({
  name: "current_connect_top",
  initialState: initialstate,

  reducers: {
    // upadate the connect by the feed from the payload
    updateCurrentConnectTop: (state, action) => {
      state.connectTop = action.payload;
    },
    // update the recent change in either of connect
    updateCurrentConnectID: (state, action) => {
      const userIdRemove = action.payload;
      state.connectTop = state.connectTop.filter((connect) => {
        return connect._id !== userIdRemove;
      });
    },

    // nullify connect
    resetClearCurrentConnectTop: (state) => {
      state.connectTop = null;
    },
  },
});

// exporting actions
export const {
  updateCurrentConnectTop,
  resetClearCurrentConnectTop,
  updateCurrentConnectID,
} = CurrentConnect.actions;

// exporting the main fun reducer
export default CurrentConnect.reducer;
