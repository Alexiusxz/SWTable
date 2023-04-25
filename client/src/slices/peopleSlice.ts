import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOneMan, IPeople } from "../Types/Types";

interface PeopleState extends IPeople {
  loading: boolean;
}
const initialState: PeopleState = {
  people: [],
  loading: false,
};

export const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    getPeople: (state, action: PayloadAction<IOneMan[]>) => {
      state.people = [...action.payload];
    },
    clearStore: (state) => {
      state.people = [];
    },
    delRow: (state, action: PayloadAction<number>) => {
      state.people.splice(action.payload, 1);
    },
    sortTable: (state, action: PayloadAction<IOneMan[]>) => {
      state.people = [...action.payload];
    },
    addPerson: (state, action: PayloadAction<IOneMan>) => {
      state.people.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  getPeople,
  clearStore,
  delRow,
  sortTable,
  addPerson,
  setLoading,
} = peopleSlice.actions;

export default peopleSlice.reducer;