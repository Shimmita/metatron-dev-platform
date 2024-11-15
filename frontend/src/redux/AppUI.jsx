import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  // view state
  defaultState: true, // default
  isAccountSettings: false,
  isAbout: false,
  isScrolledDown: false,
  isMobileRighBar: false,
  isSearchBar: true,
  isOpenMessageDrawer: false,
  isSidebarRighbar: true,
  isTabSideBar: true,
  // theme
  isDarkMode: false,
  currentMode: "light",
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
        currentMode: state.currentMode === "light" ? "dark" : "light",
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

    // manage showing of sidebar and righbar appropriately when invoked
    handleSidebarRightbar: (state) => {
      return {
        ...state,

        isSidebarRighbar: !state.isSidebarRighbar,
      };
    },

    // manage showing of sidebar specific for tabs to allow toggling of fullscreen
    showTabSideBar: (state) => {
      return {
        ...state,
        isTabSideBar: !state.isTabSideBar,
      };
    },
  },
});

// exporting the actions
export const {
  showAccountSettings,
  resetAll,
  resetDarkMode,
  showAbout,
  handleScrolledDown,
  showMobileRighBar,
  showMessagingDrawer,
  showTabSideBar,
  handleSidebarRightbar,
} = appUISliceReducerSlice.actions;

// export the appUISliceReducer for universal purposes
export default appUISliceReducerSlice.reducer;
