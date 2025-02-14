import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  globalSearchResults: null,
};

const CurrentGlobalSearch = createSlice({
  name: "current_global_search_results",
  initialState: initialstate,

  reducers: {
    // upadate the search results by the feed from the payload
    updateCurrentGlobalSearchResults: (state, action) => {
      state.globalSearchResults = action.payload;
    },

    // nullify global search results and
    resetClearCurrentGlobalSearch: (state) => {
      state.globalSearchResults = null;
    },
  },
});

// exporting actions
export const {
  updateCurrentGlobalSearchResults,
  resetClearCurrentGlobalSearch,
} = CurrentGlobalSearch.actions;

// exporting the main fun reducer
export default CurrentGlobalSearch.reducer;
