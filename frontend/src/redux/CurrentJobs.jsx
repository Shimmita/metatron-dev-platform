import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  jobs: null,
};

const CurrentJobs = createSlice({
  name: "current_jobs",
  initialState: initialstate,

  reducers: {
    // upadte  user and online status to true
    updateCurrentJobs: (state, action) => {
      state.jobs = action.payload;
    },

    // nullify user and fale online
    resetClearCurrentJobs: (state) => {
      state.jobs = null;
    },
  },
});

// exporting actions
export const { updateCurrentJobs, resetClearCurrentJobs } = CurrentJobs.actions;

// exporting the main fun reducer
export default CurrentJobs.reducer;
