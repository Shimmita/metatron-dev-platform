import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  myNetwork: null,
};

const CurrentNetwork = createSlice({
  name: "current_network",
  initialState: initialstate,

  reducers: {
    // update the networks of friends by the feed from the payload
    updateCurrentNetwork: (state, action) => {
      state.myNetwork = action.payload;
    },

     // update the recent change in network based on the ID
    updateCurrentNetworkID: (state, action) => {
      const networkId = action.payload;
      state.myNetwork = state.myNetwork.filter((network) => {
        return network._id !== networkId;
      });
    },

    // nullify network and
    resetClearCurrentNetwork: (state) => {
      state.myNetwork = null;
    },
  },
});

// exporting actions
export const { updateCurrentNetwork, updateCurrentNetworkID, resetClearCurrentNetwork } =
  CurrentNetwork.actions;

// exporting the main fun reducer
export default CurrentNetwork.reducer;
