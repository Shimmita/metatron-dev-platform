import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // using localStorage as the storage engine

import { combineReducers } from "redux";

import appUISliceReducer from "./AppUI";
import completeSigningReducer from "./CompleteSigning";
import currentUserReducer from "./CurrentUser";
import currentPostsReducer from "./CurrentPosts";

// Configure persist settings
const persistConfig = {
  key: "root", // Key to identify persisted data
  storage,
};

// Combine all reducers
const rootReducer = combineReducers({
  appUI: appUISliceReducer,
  signUser: completeSigningReducer,
  currentUser: currentUserReducer,
  currentPosts: currentPostsReducer,
});

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

// Create the persistor
const persistor = persistStore(store);

// Exporting both store and persistor for UI rehydration
export { persistor, store };
