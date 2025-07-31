import type { Image } from "./image.interface";

export interface Product {
  productId: string;
  name: string;
  description: string;
  price?: number;
  stockQuantity?: number;
  qrCodeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: Image[];
}