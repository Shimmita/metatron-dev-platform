import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  coursesTop: null,
};

const CurrentCoursesTop = createSlice({
  name: "current_courses_top",
  initialState: initialstate,

  reducers: {
    updateCurrentCoursesTop: (state, action) => {
      state.coursesTop = action.payload;
    },

    resetClearCurrentCoursesTop: (state) => {
      state.coursesTop = null;
    },
  },
});

export const { updateCurrentCoursesTop, resetClearCurrentCoursesTop } =
  CurrentCoursesTop.actions;

export default CurrentCoursesTop.reducer;
