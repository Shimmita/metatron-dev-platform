import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  defaultState: true, // default
  isAccountSettings: false,
  isDefaultBottomNav: true,
  isDefaultSpeedDial: true,
  isMobileRighBar: false,
  isSearchBar: true,
  isOpenMessageDrawer: false,
  isOpenDrawerProfile: false,
  isMessageProfile: false,
  isSidebarRighbar: true,
  isTabSideBar: true,
  isPostModalRedux: false,
  isLoadingPostLaunch: false,
  isSimilarCoursesModal: false,
  isJobSearchGlobal: false,
  isPostDetailed: false,

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

    // update is post detaled that wll be used to override speed dial state
    handleUpdateIsPostDetailed: (state, action) => {
      state.isPostDetailed = action.payload;
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

    // show the profile drawer when user clicks avatar navbar
    showUserProfileDrawer: (state) => {
      return {
        ...state,
        isOpenDrawerProfile: !state.isOpenDrawerProfile,
      };
    },

    // handle showing message input when profile drawer is opened
    showProfileDrawerMessageInput: (state, action) => {
      state.isMessageProfile = action.payload;
    },

    // reset the showing of message input when profile is opened
    resetClearShowMessageInput: (state) => {
      state.isMessageProfile = false;
    },

    // manage showing of sidebar and righbar appropriately when invoked
    handleSidebarRightbar: (state) => {
      return {
        ...state,

        isSidebarRighbar: !state.isSidebarRighbar,
      };
    },

    // handle job search results from global search bar, routing to jobs page
    handleIsJobsGlobalResults: (state, action) => {
      state.isJobSearchGlobal = action.payload;
    },

    // manage showing of sidebar specific for tabs to allow toggling of fullscreen
    showTabSideBar: (state) => {
      return {
        ...state,
        isTabSideBar: !state.isTabSideBar,
      };
    },

    // reset all UI states to default
    resetAll: (state) => {
      return {
        ...state,
        defaultState: true,
        isAccountSettings: false,
        isDefaultBottomNav: true,
        isMobileRighBar: false,
        isSearchBar: true,
        isOpenMessageDrawer: false,
        isOpenDrawerProfile: false,
        isSidebarRighbar: true,
        isTabSideBar: true,
        isPostModalRedux: false,
        isLoadingPostLaunch: false,
        isSimilarCoursesModal: false,
        isDefaultSpeedDial: true,
        isMessageProfile: false,
        isJobSearchGlobal: false,
        isPostDetailed: false,
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
  showUserProfileDrawer,
  showProfileDrawerMessageInput,
  resetClearShowMessageInput,
  showTabSideBar,
  handleSidebarRightbar,
  showPostModalRedux,
  handleLoadingPostLaunch,
  resetSimilarCoursesModal,
  handleShowingSpeedDial,
  handleIsJobsGlobalResults,
  handleUpdateIsPostDetailed,
} = appUISliceReducerSlice.actions;

// export the appUISliceReducer for universal purposes
export default appUISliceReducerSlice.reducer;
