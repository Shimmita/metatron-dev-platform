import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  jobSearch: null,
};

const currentJobSearch = createSlice({
  name: "current_jobs_search",
  initialState: initialstate,

  reducers: {
    // update  user and online status to true
    updateJobSearch: (state, action) => {
      state.jobSearch = action.payload;
    },

    // nullify user and false online
    resetJobSearch: (state) => {
      state.jobSearch = null;
    },
  },
});

// exporting actions
export const { updateJobSearch, resetJobSearch } = currentJobSearch.actions;

// exporting the main fun reducer
export default currentJobSearch.reducer;
