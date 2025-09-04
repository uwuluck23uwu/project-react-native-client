import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { animalApi } from "./apis/animal.api";
import { habitatApi } from "./apis/habitat.api";
import { newsApi } from "./apis/news.api";
import { locationApi } from "./apis/location.api";
import { ticketApi } from "./apis/ticket.api";
import { eventApi } from "./apis/event.api";
import { orderApi } from "./apis/order.api";
import { orderItemApi } from "./apis/orderItem.api";
import { productApi } from "./apis/product.api";
import authReducer from "./slices/auth.slice";
import animalReducer from "./slices/animal.slice";
import eventReducer from "./slices/event.slice";
import newsReducer from "./slices/news.slice";
import ticketReducer from "./slices/ticket.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    animal: animalReducer,
    event: eventReducer,
    news: newsReducer,
    ticket: ticketReducer,
    [authApi.reducerPath]: authApi.reducer,
    [animalApi.reducerPath]: animalApi.reducer,
    [habitatApi.reducerPath]: habitatApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [orderItemApi.reducerPath]: orderItemApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      authApi.middleware,
      animalApi.middleware,
      habitatApi.middleware,
      newsApi.middleware,
      locationApi.middleware,
      ticketApi.middleware,
      eventApi.middleware,
      orderApi.middleware,
      orderItemApi.middleware,
      productApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
