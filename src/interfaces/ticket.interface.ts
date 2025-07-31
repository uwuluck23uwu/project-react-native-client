import type { Image } from "./image.interface";

export interface Ticket {
  ticketId: string;
  ticketType: string;
  description?: string;
  price?: number;
  purchaseDate?: string;
  visitDate?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: Image[];
}
