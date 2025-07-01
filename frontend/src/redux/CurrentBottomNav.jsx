import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  position: 0,
};

const CurrentBottomNav = createSlice({
  name: "current_bottom_nav",
  initialState: initialstate,

  reducers: {
    // update  the position of bottom nav
    updateCurrentBottomNav: (state, action) => {
      state.position = action.payload;
    },
  },
});

// exporting actions
export const { updateCurrentBottomNav } = CurrentBottomNav.actions;

// exporting the main fun reducer
export default CurrentBottomNav.reducer;
