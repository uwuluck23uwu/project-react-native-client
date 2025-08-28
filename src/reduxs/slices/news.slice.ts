import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { News } from "@/interfaces/news.interface";

interface NewsState {
  news: News[];
  search: string;
  selectedIds: string[];
  filterStatus: string | null;
}

const initialState: NewsState = {
  news: [],
  search: "",
  selectedIds: [],
  filterStatus: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setNews: (state, action: PayloadAction<News[]>) => {
      state.news = action.payload;
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
  setNews,
  setSearch,
  setSelectedIds,
  toggleSelectedId,
  clearSelectedIds,
  setFilterStatus,
} = newsSlice.actions;
export default newsSlice.reducer;
