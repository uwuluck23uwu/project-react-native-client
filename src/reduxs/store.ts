import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { animalApi } from "./apis/animal.api";
import { habitatApi } from "./apis/habitat.api";
import { newsApi } from "./apis/news.api";
import { ticketApi } from "./apis/ticket.api";
import { eventApi } from "./apis/event.api";
import { productApi } from "./apis/product.api";
import { locationApi } from "./apis/location.api";
import authReducer from "./slices/auth.slice";
import animalReducer from "./slices/animal.slice";
import ticketReducer from "./slices/ticket.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    animal: animalReducer,
    ticket: ticketReducer,
    [authApi.reducerPath]: authApi.reducer,
    [animalApi.reducerPath]: animalApi.reducer,
    [habitatApi.reducerPath]: habitatApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      authApi.middleware,
      animalApi.middleware,
      habitatApi.middleware,
      newsApi.middleware,
      ticketApi.middleware,
      eventApi.middleware,
      productApi.middleware,
      locationApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
