import { configureStore } from "@reduxjs/toolkit";
import appUISliceReducer from "./AppUI";

export default configureStore({
  reducer: {
    // reducer for handling appUI states
    appUI: appUISliceReducer,
    // more other reducers
  },
});

// export the store for universal access
