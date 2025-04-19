import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  myNetwork: null,
};

const CurrentNetwork = createSlice({
  name: "current_network",
  initialState: initialstate,

  reducers: {
    // upadate the networks of friends by the feed from the payload
    updateCurrentNetwork: (state, action) => {
      state.myNetwork = action.payload;
    },

    // nullify job and
    resetClearCurrentNetwork: (state) => {
      state.myNetwork = null;
    },
  },
});

// exporting actions
export const { updateCurrentNetwork, resetClearCurrentNetwork } =
  CurrentNetwork.actions;

// exporting the main fun reducer
export default CurrentNetwork.reducer;
