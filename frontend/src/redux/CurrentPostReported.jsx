import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  reportedPost: null,
};

const CurrentPostReported = createSlice({
  name: "current_connect_post_reported",
  initialState: initialstate,

  reducers: {
    // upadate the reportedPost by the feed from the payload
    updateCurrentReport: (state, action) => {
      state.reportedPost = action.payload;
    },

    /*  update report by passing the ID of the report specially when user clicks
     they have viewed or closed. since the main message is governed by admin
    and cant be deleted by the targeted or post owner for  official references */

    updateCurrentReportID: (state, action) => {
      const connectRequestID = action.payload;
      state.reportedPost = state.reportedPost.filter((connect) => {
        return connect._id !== connectRequestID;
      });
    },

    // nullify the reported post to null
    resetClearCurrentReport: (state) => {
      state.reportedPost = null;
    },
  },
});

// exporting actions
export const {
  updateCurrentReport,
  resetClearCurrentReport,
  updateCurrentReportID,
} = CurrentPostReported.actions;

// exporting the main fun reducer
export default CurrentPostReported.reducer;
