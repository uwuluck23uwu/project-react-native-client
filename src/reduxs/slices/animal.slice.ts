import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Animal } from "@/interfaces/animal.interface";

interface AnimalState {
  animals: Animal[];
  search: string;
  selectedIds: string[];
  filterStatus: string | null;
}

const initialState: AnimalState = {
  animals: [],
  search: "",
  selectedIds: [],
  filterStatus: null,
};

const animalSlice = createSlice({
  name: "animal",
  initialState,
  reducers: {
    setAnimals: (state, action: PayloadAction<Animal[]>) => {
      state.animals = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSelectedIds: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    toggleSelectedId: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((item) => item !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearSelectedIds: (state) => {
      state.selectedIds = [];
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
    },
  },
});

export const {
  setAnimals,
  setSearch,
  setSelectedIds,
  toggleSelectedId,
  clearSelectedIds,
  setFilterStatus,
} = animalSlice.actions;
export default animalSlice.reducer;
