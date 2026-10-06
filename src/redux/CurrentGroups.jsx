import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  groups: null,
};

const CurrentGroups = createSlice({
  name: "current_groups_communities",
  initialState: initialstate,

  reducers: {
    // update the groups and communities 
    // by the feed from the payload
    updateCurrentGroupsCommunities: (state, action) => {
    state.groups = action.payload;
    },

    // nullify groups and communities and 
    resetClearCurrentGroupCommunities: (state) => {
    state.groups = null;
    },
},
});

// exporting actions
export const { 
    updateCurrentGroupsCommunities, 
    resetClearCurrentGroupCommunities } = CurrentGroups.actions;

// exporting the main fun reducer
export default CurrentGroups.reducer;
