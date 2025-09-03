import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  courses: null,
};

const CurrentCourses = createSlice({
  name: "current_courses",
  initialState: initialstate,

  reducers: {
    // update the courses by the feed from the payload
    updateCurrentCourses: (state, action) => {
      state.courses = action.payload;
    },

    // nullify courses  
    resetClearCurrentCourses: (state) => {
      state.courses = null;
    },
  },
});

// exporting actions
export const { updateCurrentCourses, resetClearCurrentCourses } = CurrentCourses.actions;

// exporting the main fun reducer
export default CurrentCourses.reducer;
