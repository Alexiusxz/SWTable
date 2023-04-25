/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPage } from "../Types/Types";


const initialState: IPage = {
  next: null,
  previous: null,
}

export const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    setLinks: (state, action: PayloadAction<IPage>) => {
      return state=action.payload;
    },
    delLinks: (state) => {
      return state = {
        next: null,
        previous: null,
      }
    },
  },
});

export const { setLinks, delLinks } = pagesSlice.actions;

export default pagesSlice.reducer;
