import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import { albumsApi } from '../services/albumsApi';
import { authApi } from '../services/authApi';


const rootReducer = combineReducers({
  auth: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [albumsApi.reducerPath]: albumsApi.reducer
});

const persistedReducer = persistReducer(
  {
    key: "root",
    version: 1,
    storage: storage,
  },
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(albumsApi.middleware, authApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;

/**This code sets up a Redux store using Redux Toolkit and Redux Persist. It's mainly used in a React application for state management.

Let's break down the code step by step:

Imports:

configureStore and getDefaultMiddleware are imported from "@reduxjs/toolkit". configureStore is a helper function to create a Redux store with some default configurations, while getDefaultMiddleware is used to get the default middleware provided by Redux Toolkit.
combineReducers is imported from "redux", which is a utility to combine multiple reducers into a single reducer.
Redux Persist related functions and constants are imported from "redux-persist". Redux Persist is a library to persist and rehydrate a Redux store.
storage is imported from "redux-persist/lib/storage", which is the default storage engine for Redux Persist.
authSlice is imported from "./slices/auth", which is a file containing a slice of the Redux state related to authentication.
The rootReducer is created using combineReducers, combining the auth reducer from authSlice.
The persistedReducer is created using persistReducer, which takes two arguments: a configuration object and the rootReducer. The configuration object contains the key for the persisted state, the version of the persisted state, and the storage engine to use (in this case, the default storage).
The Redux store is created using configureStore, passing the persistedReducer and default middleware with some modifications. The serializableCheck middleware option ignores certain Redux Persist actions to avoid unnecessary warnings, as they are not serializable.
The persistor is created using persistStore and the store. The persistor is responsible for persisting and rehydrating the Redux store.
The RootState type is exported, which is the type of the state managed by the rootReducer. This is useful for type-checking with TypeScript.
Finally, the store is exported as the default export, which can be used to set up the Redux provider in the React application. 
"Persist" and "rehydrate" in the context of Redux Persist refer to the process of saving and restoring the Redux store's state. Here's a brief explanation of these terms:
Persist: To save the current state of the Redux store to a storage system, such as local storage, session storage, or a custom storage engine. This process is performed to maintain the state even if the user refreshes the page, closes the browser, or navigates away from the application. When the state is persisted, it's serialized and stored in the chosen storage system.
Rehydrate: To restore the persisted state from the storage system back into the Redux store when the application is loaded or reloaded. This process ensures that the application state is maintained across sessions, providing a seamless user experience. Rehydration involves retrieving the serialized state from the storage, deserializing it, and merging it with the initial state of the Redux store.
In summary, Redux Persist is a library that helps maintain the state of a Redux store by persisting it to a storage system and rehydrating it when needed. This is particularly useful for web applications where the user might refresh the page or navigate away, as it allows the application to maintain its state and provide a consistent user experience.*/

