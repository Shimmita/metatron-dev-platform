import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  // view state
  defaultState: true, // default
  isAccountSettings: false,
  isHelpQuiz: false,
  isReportUser: false,
  isAbout: false,
  isScrolledDown: false,
  isMobileRighBar: false,
  isSearchBar: true,
  isOpenMessageDrawer: false,

  // theme
  isDarkMode: false,
};

const appUISliceReducerSlice = createSlice({
  name: "AppUI",
  initialState,
  reducers: {
    showAccountSettings: (state) => {
      return {
        ...state,
        defaultState: false,
        isAccountSettings: true,
      };
    },

    resetAll: (state) => {
      return {
        ...state,
        defaultState: true,
        isAccountSettings: false,
        isReportUser: false,
        isAbout: false,
      };
    },

    resetDarkMode: (state) => {
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    },

    showHelpQuiz: (state) => {
      return {
        ...state,
        defaultState: false,
        isHelpQuiz: true,
      };
    },

    showReportUser: (state) => {
      return {
        ...state,
        defaultState: false,
        isReportUser: true,
      };
    },

    // manages user scrolling
    handleScrolledDown: (state, action) => {
      state.isScrolledDown = action.payload;
    },

    // manages right bar
    showMobileRighBar: (state) => {
      return {
        ...state,
        isMobileRighBar: !state.isMobileRighBar,
      };
    },
    // manage showing message and notification drawer
    showMessagingDrawer: (state) => {
      return {
        ...state,
        isOpenMessageDrawer: !state.isOpenMessageDrawer,
      };
    },
  },
});

// exporting the actions
export const {
  showAccountSettings,
  resetAll,
  resetDarkMode,
  showHelpQuiz,
  showReportUser,
  showAssistEmail,
  showAbout,
  handleScrolledDown,
  showMobileRighBar,
  showMessagingDrawer,
} = appUISliceReducerSlice.actions;

// export the appUISliceReducer for universal purposes
export default appUISliceReducerSlice.reducer;
