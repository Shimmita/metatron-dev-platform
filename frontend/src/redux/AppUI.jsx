import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  defaultState: true, // default
  isAccountSettings: false,
  isAbout: false,
  isDefaultBottomNav: true,
  isDefaultSpeedDial: true,
  isMobileRighBar: false,
  isSearchBar: true,
  isOpenMessageDrawer: false,
  isSidebarRighbar: true,
  isTabSideBar: true,
  isPostModalRedux: false,
  isLoadingPostLaunch: false,
  isSimilarCoursesModal: false,

  // theme
  isDarkMode: false,
  currentMode: "light",
};

const appUISliceReducerSlice = createSlice({
  name: "appUI",
  initialState,
  reducers: {
    handleLoadingPostLaunch: (state, action) => {
      state.isLoadingPostLaunch = action.payload;
    },

    showPostModalRedux: (state) => {
      state.isPostModalRedux = !state.isPostModalRedux;
    },

    showAccountSettings: (state) => {
      return {
        ...state,
        defaultState: false,
        isAccountSettings: true,
      };
    },
    // controls the modal similar courses
    resetSimilarCoursesModal: (state) => {
      state.isSimilarCoursesModal = !state.isSimilarCoursesModal;
    },

    // reset all UI states to default
    resetAll: (state) => {
      return {
        ...state,
        defaultState: true,
        isAccountSettings: false,
        isAbout: false,
        isDefaultBottomNav: true,
        isMobileRighBar: false,
        isSearchBar: true,
        isOpenMessageDrawer: false,
        isSidebarRighbar: true,
        isTabSideBar: true,
        isPostModalRedux: false,
        isLoadingPostLaunch: false,
        isSimilarCoursesModal: false,
        isDefaultSpeedDial: true,
      };
    },

    resetDarkMode: (state) => {
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
        currentMode: state.currentMode === "light" ? "dark" : "light",
      };
    },

    // manages the display of the default bottom nav
    handleDefaultBottomNav: (state) => {
      state.isDefaultBottomNav = false;
    },

    // handle showing of the speed dial
    handleShowingSpeedDial: (state, action) => {
      state.isDefaultSpeedDial = action.payload;
    },

    // reset the to default the showing of the default bottom nav

    resetDefaultBottomNav: (state) => {
      state.isDefaultBottomNav = true;
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
  handleDefaultBottomNav,
  resetDefaultBottomNav,
  showMobileRighBar,
  showMessagingDrawer,
  showTabSideBar,
  handleSidebarRightbar,
  showPostModalRedux,
  handleLoadingPostLaunch,
  resetSimilarCoursesModal,
  handleShowingSpeedDial,
} = appUISliceReducerSlice.actions;

// export the appUISliceReducer for universal purposes
export default appUISliceReducerSlice.reducer;
