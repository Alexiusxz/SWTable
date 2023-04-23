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
  },
});

export const { setLinks } = pagesSlice.actions;

export default pagesSlice.reducer;
