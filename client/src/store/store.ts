import { configureStore } from "@reduxjs/toolkit";
import peopleReducer from "../slices/peopleSlice";
import pagesReducer from '../slices/pagesSlice'

const store = configureStore({
  reducer: {
    people: peopleReducer,
    pages:pagesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
