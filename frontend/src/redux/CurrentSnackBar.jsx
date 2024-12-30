import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  messageSnackPostTech: "",
  messageSnack: "",
};

const CurrentSnackBar = createSlice({
  name: "current_snackbar",
  initialState: initialstate,

  reducers: {
    updateCurrentSnackPostSuccess: (state, action) => {
      state.messageSnackPostTech = action.payload;
    },
    // upadte  user and online status to true
    updateCurrentSnackBar: (state, action) => {
      state.messageSnack = action.payload;
    },

    // nullify user and fale online
    resetClearCurrentSnack: (state) => {
      state.messageSnack = "";
      state.messageSnackPostTech = "";
    },
  },
});

// exporting actions
export const {
  updateCurrentSnackBar,
  updateCurrentSnackPostSuccess,
  resetClearCurrentSnack,
} = CurrentSnackBar.actions;

// exporting the main fun reducer
export default CurrentSnackBar.reducer;
