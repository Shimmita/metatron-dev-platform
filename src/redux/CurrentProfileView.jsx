import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  profile_views: [],
};

const CurrentProfileView = createSlice({
  name: "current_profile_view",
  initialState: initialstate,

  reducers: {
    // update the profile view by the feed from the payload
    updateCurrentProfileViews: (state, action) => {
      state.profile_views = action.payload;
    },

    // delete a profile view
    deleteCurrentProfileView: (state, action) => {
      // getting passed payload
      const currentProfileView = action.payload;
      // use filter to return new array that has not the passed payload based on ID
      state.profile_views = state.profile_views.filter(
        (profile_view) => profile_view._id !== currentProfileView._id
      );
    },

    // nullify job and
    resetClearCurrentProfileView: (state) => {
      state.profile_views = null;
    },
  },
});

// exporting actions
export const {
  updateCurrentProfileViews,
  resetClearCurrentProfileView,
  deleteCurrentProfileView,
} = CurrentProfileView.actions;

// exporting the main fun reducer
export default CurrentProfileView.reducer;
