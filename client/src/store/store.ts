import { configureStore } from "@reduxjs/toolkit";
import peopleReducer from "../slices/peopleSlice";

const store = configureStore({
  reducer: {
    people: peopleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
