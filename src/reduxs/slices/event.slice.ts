import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "@/interfaces/event.interface";

interface EventState {
  events: Event[];
  search: string;
  selectedIds: string[];
  filterStatus: string | null;
}

const initialState: EventState = {
  events: [],
  search: "",
  selectedIds: [],
  filterStatus: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
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
  setEvents,
  setSearch,
  setSelectedIds,
  toggleSelectedId,
  clearSelectedIds,
  setFilterStatus,
} = eventSlice.actions;
export default eventSlice.reducer;
