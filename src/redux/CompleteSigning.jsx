import { createSlice } from "@reduxjs/toolkit";

const initialstate = {
  username: "",
  email: "",
  avatar: "",
  token: "",
};

const completRegistrationSlice = createSlice({
  name: "complete_signing",
  initialState: initialstate,

  reducers: {
    // update the temp details returned by the auth prov for name,email,avatar,country
    updateTempUserDetails: (state, action) => {
      const { username, email, avatar, token } = action.payload;

      state.username = username || state.username;
      state.email = email || state.email;
      state.avatar = avatar || state.avatar;
      state.token = token || state.token;
    },

    // reset temp details plus all states of the auth providers
    resetAllSigningStateDetails: (state) => {
      state.isGoogle = false;
      state.email = "";
      state.username = "";
      state.avatar = "";
      state.token = "";
    },
  },
});

// exporting actions
export const { updateTempUserDetails, resetAllSigningStateDetails } =
  completRegistrationSlice.actions;

// exporting the main fun reducer
export default completRegistrationSlice.reducer;
