import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOneMan, IPeople } from "../Types/Types";


const initialState: IPeople = {
  people:[]
};

export const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    getPeople: (state, action: PayloadAction<IOneMan[]>) => {
      state.people=[...action.payload];
    },
    clearStore: (state) => {
      state.people=[];
    },
    delRow: (state, action: PayloadAction<number>) => {
      state.people.splice(action.payload,1);
    },
  },
});

export const { getPeople, clearStore, delRow  } = peopleSlice.actions;

export default peopleSlice.reducer;
