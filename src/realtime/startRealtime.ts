import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { BASE_URL } from "@/utils";
import store from "@/reduxs/store";
import { animalApi } from "@/reduxs/apis/animal.api";
import { eventApi } from "@/reduxs/apis/event.api";
import { habitatApi } from "@/reduxs/apis/habitat.api";
import { locationApi } from "@/reduxs/apis/location.api";
import { newsApi } from "@/reduxs/apis/news.api";
import { productApi } from "@/reduxs/apis/product.api";
import { ticketApi } from "@/reduxs/apis/ticket.api";

let conn: HubConnection | null = null;

function ensureConnection(): HubConnection {
  if (!conn) {
    conn = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/signal`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }
  return conn;
}

export function startRealtime() {
  const connection = ensureConnection();
  connection.off("AnimalChanged");
  connection.off("EventChanged");
  connection.off("HabitatChanged");
  connection.off("LocationChanged");
  connection.off("NewsChanged");
  connection.off("ProductChanged");
  connection.off("TicketChanged");

  connection.on("AnimalChanged", (_payload: any) => {
    store.dispatch(
      animalApi.util.invalidateTags([{ type: "Animals", id: "LIST" }])
    );
  });
  connection.on("EventChanged", (_payload: any) => {
    store.dispatch(
      eventApi.util.invalidateTags([{ type: "Events", id: "LIST" }])
    );
  });
  connection.on("HabitatChanged", (_payload: any) => {
    store.dispatch(
      habitatApi.util.invalidateTags([{ type: "Habitats", id: "LIST" }])
    );
  });
  connection.on("LocationChanged", (_payload: any) => {
    store.dispatch(
      locationApi.util.invalidateTags([{ type: "Locations", id: "LIST" }])
    );
  });
  connection.on("NewsChanged", (_payload: any) => {
    store.dispatch(newsApi.util.invalidateTags([{ type: "News", id: "LIST" }]));
  });
  connection.on("ProductChanged", (_payload: any) => {
    store.dispatch(
      productApi.util.invalidateTags([{ type: "Products", id: "LIST" }])
    );
  });
  connection.on("TicketChanged", (_payload: any) => {
    store.dispatch(
      ticketApi.util.invalidateTags([{ type: "Tickets", id: "LIST" }])
    );
  });

  if (connection.state === HubConnectionState.Disconnected) {
    connection.start().catch(console.warn);
  }

  return () => {
    if (!conn) return;
    conn.off("AnimalChanged");
    conn.off("EventChanged");
    conn.off("HabitatChanged");
    conn.off("LocationChanged");
    conn.off("NewsChanged");
    conn.off("ProductChanged");
    conn.off("TicketChanged");

    conn.stop().catch(console.warn);
  };
}
