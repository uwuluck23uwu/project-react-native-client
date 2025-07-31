import type { Image } from "./image.interface";

export interface News {
  newsId: string;
  title: string;
  contents: string;
  publishedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: Image[];
}