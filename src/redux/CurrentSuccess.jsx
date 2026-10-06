import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  title: null,
  isActive: false,
  message: null,
};

const CurrentSuccess = createSlice({
  name: "current_success_redux",
  initialState: initialstate,

  reducers: {
    // update title and message from payload
    updateCurrentSuccessRedux: (state, action) => {
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.isActive = true;
    },

    // nullify details
    resetClearCurrentSuccessRedux: (state) => {
      state.title = null;
      state.message = null;
      state.isActive = false;
    },

  },
});

// exporting actions
export const {
  updateCurrentSuccessRedux,
  resetClearCurrentSuccessRedux,
  
} = CurrentSuccess.actions;

// exporting the main fun reducer
export default CurrentSuccess.reducer;
