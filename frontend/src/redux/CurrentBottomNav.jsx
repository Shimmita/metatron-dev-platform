import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  position: 0,
};

const CurrentBottomNav = createSlice({
  name: "current_bottomnav",
  initialState: initialstate,

  reducers: {
    // upadte  user and online status to true
    updateCurrentBottomNav: (state, action) => {
      state.position = action.payload;
    },
  },
});

// exporting actions
export const { updateCurrentBottomNav } = CurrentBottomNav.actions;

// exporting the main fun reducer
export default CurrentBottomNav.reducer;
