import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  user: null,
  isOnline: false,
  isGuest:true,
  tempUserProfileID: null,
  usersCount:0,
};

const currentUser = createSlice({
  name: "current_user_redux",
  initialState: initialstate,

  reducers: {
    // update  user and online status to true
    updateUserCurrentUserRedux: (state, action) => {
      state.user = action.payload;
      state.isOnline = true;
      state.isGuest=false
    },

    // nullify user and false online
    resetClearCurrentUserRedux: (state) => {
      state.user = null;
      state.isOnline = false;
      state.isGuest=true;
    },

    // update user count
    updateUserCountRedux:(state,action)=>{
      state.usersCount=action.payload
    },

    // update tempUser ID for temp profile review
    updateTempUserIDRedux: (state, action) => {
      state.tempUserProfileID = action.payload;
    },

    // nullify the tempUser
    resetClearTempUserIDRedux: (state) => {
      state.tempUserProfileID = null;
    },
  },
});

// exporting actions
export const {
  updateUserCurrentUserRedux,
  resetClearCurrentUserRedux,
  updateTempUserIDRedux,
  resetClearTempUserIDRedux,
  updateUserCountRedux
} = currentUser.actions;

// exporting the main fun reducer
export default currentUser.reducer;
