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
  isLoadingPostLaunch: false,
  isJobSearchGlobal: false,
  isPostDetailed: false,
  isOpenSupportAlert: false,
  isOpenSponsorAlert: false,
  isOpenAboutMetatron: false,
  isPostEditModal:false,
  isPostFullDetailModal:false,
  isLogoutAlert:false,
  postEditUniqueId:"",
  notificationPosition:0,

  // theme
  currentMode: "light",
};

const appUISliceReducerSlice = createSlice({
  name: "appUI",
  initialState,
  reducers: {
    handleLoadingPostLaunch: (state, action) => {
      state.isLoadingPostLaunch = action.payload;
    },

  

    showAccountSettings: (state) => {
      return {
        ...state,
        defaultState: false,
        isAccountSettings: true,
      };
    },
  

    resetDarkMode: (state) => {
      return {
        ...state,
        currentMode: state.currentMode === "light" ? "dark" : "light",
      };
    },

     // manage showing of logout alert
     handleShowLogout:(state,action)=>{
      state.isLogoutAlert=action.payload
     },
    
    // manages the display of the default bottom nav
    handleDefaultBottomNav: (state) => {
      state.isDefaultBottomNav = false;
    },

    // handle showing of the speed dial
    handleShowingSpeedDial: (state, action) => {
      state.isDefaultSpeedDial = action.payload;
    },

    // update is post detailed that wll be used to override speed dial state
    handleUpdateIsPostDetailed: (state, action) => {
      state.isPostDetailed = action.payload;
    },

    // handle showing of post full details modal
    handleShowingPostDetailedModal:(state,action)=>{
      state.isPostFullDetailModal=action.payload
    },

    // handle opening and closing of post edit modal
    handleShowPostEditModal:(state,action)=>{
      state.isPostEditModal=action.payload
    },

    // set the postEditId
    handleSetPostEditIdModal:(state,action)=>{
      state.postEditUniqueId=action.payload
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
    showMessagingDrawer: (state,action) => {
      return {
        ...state,
        notificationPosition:action.payload,
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

    // manage showing of sidebar and rightbar appropriately when invoked
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

    // manage showing of the alert support
    showSupportAlert: (state, action) => {
      state.isOpenSupportAlert = action.payload;
    },

    // manage showing of the sponsor alert
    showSponsorAlert: (state, action) => {
      state.isOpenSponsorAlert = action.payload;
    },

    // manage showing of the about metatron alert
    showAboutMetatron: (state, action) => {
      state.isOpenAboutMetatron = action.payload;
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
        isLoadingPostLaunch: false,
        isDefaultSpeedDial: true,
        isMessageProfile: false,
        isJobSearchGlobal: false,
        isPostDetailed: false,
        isOpenSponsorAlert: false,
        isOpenSupportAlert: false,
        isOpenAboutMetatron: false,
        isPostEditModal:false,
        isPostFullDetailModal:false,
        postEditUniqueId:'',
        isLogoutAlert:false,
        notificationPosition:0,


      };
    },
  },
});

// exporting the actions
export const {
  showAccountSettings,
  resetAll,
  resetDarkMode,
  handleDefaultBottomNav,
  resetDefaultBottomNav,
  showMobileRighBar,
  showMessagingDrawer,
  showUserProfileDrawer,
  showProfileDrawerMessageInput,
  resetClearShowMessageInput,
  showTabSideBar,
  handleSidebarRightbar,
  handleLoadingPostLaunch,
  handleShowingSpeedDial,
  handleIsJobsGlobalResults,
  handleUpdateIsPostDetailed,
  showSponsorAlert,
  showSupportAlert,
  showAboutMetatron,
  handleShowPostEditModal,
  handleSetPostEditIdModal,
  handleShowingPostDetailedModal,
  handleShowLogout
} = appUISliceReducerSlice.actions;

// export the appUISliceReducer for universal purposes
export default appUISliceReducerSlice.reducer;
