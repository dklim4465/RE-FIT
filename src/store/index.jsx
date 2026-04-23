import { configureStore } from "@reduxjs/toolkit";
import routineReducer from "./routineSlice";

export const store = configureStore({
  reducer: {
    routines: routineReducer,
  },
});
