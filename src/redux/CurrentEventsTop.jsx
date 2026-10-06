import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  eventsTop: null,
};

const CurrentEventsTop = createSlice({
  name: "current_events_top",
  initialState: initialstate,

  reducers: {
    // update the events by the feed from the payload
    updateCurrentEventsTop: (state, action) => {
      state.eventsTop = action.payload;
    },

    // nullify events and 
    resetClearCurrentEventsTop: (state) => {
      state.eventsTop = null;
    },
  },
});

// exporting actions
export const { updateCurrentEventsTop, resetClearCurrentEventsTop } =
  CurrentEventsTop.actions;

// exporting the main fun reducer
export default CurrentEventsTop.reducer;
