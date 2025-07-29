import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  events: null,
};

const CurrentEvents = createSlice({
  name: "current_events",
  initialState: initialstate,

  reducers: {
    // update the events by the feed from the payload
    updateCurrentEvents: (state, action) => {
      state.events = action.payload;
    },

    // nullify events  
    resetClearCurrentEvents: (state) => {
      state.events = null;
    },
  },
});

// exporting actions
export const { updateCurrentEvents, resetClearCurrentEvents } = CurrentEvents.actions;

// exporting the main fun reducer
export default CurrentEvents.reducer;
