import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  user: null,
  isOnline: false,
};

const currentUser = createSlice({
  name: "current_user_redux",
  initialState: initialstate,

  reducers: {
    // upadte  user and online status to true
    updateUserCurrentUserRedux: (state, action) => {
      state.user = action.payload;
      state.isOnline = true;
    },

    // nullify user and fale online
    resetClearCurrentUserRedux: (state) => {
      state.user = null;
      state.isOnline = false;
    },
  },
});

// exporting actions
export const { updateUserCurrentUserRedux, resetClearCurrentUserRedux } =
  currentUser.actions;

// exporting the main fun reducer
export default currentUser.reducer;
