import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ticket } from "@/interfaces/ticket.interface";

interface TicketState {
  tickets: Ticket[];
  search: string;
  selectedIds: string[];
  filterDate: string | null;
}

const initialState: TicketState = {
  tickets: [],
  search: "",
  selectedIds: [],
  filterDate: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
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
    setFilterDate: (state, action: PayloadAction<string | null>) => {
      state.filterDate = action.payload;
    },
  },
});

export const {
  setTickets,
  setSearch,
  setSelectedIds,
  toggleSelectedId,
  clearSelectedIds,
  setFilterDate,
} = ticketSlice.actions;

export default ticketSlice.reducer;
