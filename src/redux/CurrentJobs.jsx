import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  jobs: null,
};

const CurrentJobs = createSlice({
  name: "current_jobs",
  initialState: initialstate,

  reducers: {
    // update the job by the feed from the payload
    updateCurrentJobs: (state, action) => {
      state.jobs = action.payload;
    },

    // nullify job and 
    resetClearCurrentJobs: (state) => {
      state.jobs = null;
    },
  },
});

// exporting actions
export const { updateCurrentJobs, resetClearCurrentJobs } = CurrentJobs.actions;

// exporting the main fun reducer
export default CurrentJobs.reducer;
