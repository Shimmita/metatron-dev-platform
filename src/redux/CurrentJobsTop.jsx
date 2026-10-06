import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  jobsTop: null,
};

const CurrentJobsTop = createSlice({
  name: "current_jobs_top",
  initialState: initialstate,

  reducers: {
    // update the job by the feed from the payload
    updateCurrentJobsTop: (state, action) => {
      state.jobsTop = action.payload;
    },

    // nullify job and 
    resetClearCurrentJobsTop: (state) => {
      state.jobsTop = null;
    },
  },
});

// exporting actions
export const { updateCurrentJobsTop, resetClearCurrentJobsTop } =
  CurrentJobsTop.actions;

// exporting the main fun reducer
export default CurrentJobsTop.reducer;
