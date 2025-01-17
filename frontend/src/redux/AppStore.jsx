import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // using localStorage as the storage engine

import { combineReducers } from "redux";

import appUISliceReducer from "./AppUI";
import completeSigningReducer from "./CompleteSigning";
import currentAuthMessageReducer from "./CurrentAuthMessages";
import currentBottomNavReducer from "./CurrentBottomNav";
import currentChatBot from "./CurrentChatBot";
import currentJobsReducer from "./CurrentJobs";
import currentJobSearchReducer from "./CurrentJobSearch";
import currentJobsTopReducer from "./CurrentJobsTop";
import currentPaginationReducer from "./CurrentPagination";
import currentPostsReducer from "./CurrentPosts";
import currentSnackReducer from "./CurrentSnackBar";
import currentUserReducer from "./CurrentUser";
import currentPostReactionsReducer from "./CurrentPostReactions";

// Configure persist settings
const persistConfig = {
  key: "root", // Key to identify persisted data
  storage,
};

// Combine all reducers
const rootReducer = combineReducers({
  appUI: appUISliceReducer,
  currentSnackBar: currentSnackReducer,
  currentBottomNav: currentBottomNavReducer,
  currentAuthMessage: currentAuthMessageReducer,
  currentPagination: currentPaginationReducer,
  signUser: completeSigningReducer,
  currentUser: currentUserReducer,
  currentPosts: currentPostsReducer,
  currentJobs: currentJobsReducer,
  currentJobsTop: currentJobsTopReducer,
  currentJobSearch: currentJobSearchReducer,
  currentChatBot: currentChatBot,
  currentPostReactions: currentPostReactionsReducer,
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
