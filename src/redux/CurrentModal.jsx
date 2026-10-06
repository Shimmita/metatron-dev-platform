import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  isPeopleModal: false,
  peopleData: null,
};

const CurrentModal = createSlice({
  name: "current_modal",
  initialState: initialstate,

  reducers: {
    // upadate the people modal by the feed from the payload true/false
    updateCurrentPeopleModal: (state, action) => {
      state.isPeopleModal = action.payload;
    },

    // update the people data by the feed from the payload
    updateCurrentPeopleData: (state, action) => {
      state.peopleData = action.payload;
    },

    // reset clear people data
    resetClearPeopleData: (state) => {
      state.isPeopleModal = false;
      state.peopleData = null;
    },
  },
});

// exporting actions
export const {
  updateCurrentPeopleModal,
  updateCurrentPeopleData,
  resetClearPeopleData,
} = CurrentModal.actions;

// exporting the main fun reducer
export default CurrentModal.reducer;
