import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  tech_skip: 0,
  job_skip: 0,
  course_skip: 0,
};

const CurrentPagination = createSlice({
  name: "current_pagination",
  initialState: initialstate,

  reducers: {
    // update tech skip forward pagination
    updateTechSkipPagination: (state) => {
      state.tech_skip = state.tech_skip + 20;
    },

    // update backward skip pagination
    updateTechSkipBack: (state) => {
      state.tech_skip = state.tech_skip - 20;
    },

    // update job skip forward
    updatJobSkipPagigination: (state) => {
      state.job_skip = state.job_skip + 20;
    },

    // update jo backward skip
    updateJobSkipBack: (state) => {
      state.job_skip = state.job_skip - 20;
    },

    // update the courses skip forward
    updateCourseSkipPagination: (state) => {
      state.course_skip = state.course_skip + 20;
    },

    // update backward course skip
    updateCourseBack: (state) => {
      state.course_skip = state.course_skip - 20;
    },
  },
});

// exporting actions
export const {
  updateTechSkipPagination,
  updateTechSkipBack,
  updatJobSkipPagigination,
  updateJobSkipBack,
  updateCourseSkipPagination,
  updateCourseBack,
} = CurrentPagination.actions;

// exporting the main fun reducer
export default CurrentPagination.reducer;
