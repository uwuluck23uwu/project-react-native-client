import type { Image } from "./image.interface";

export interface Ticket {
  ticketId: string;
  ticketType: string;
  description?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
  images?: Image[];
}
