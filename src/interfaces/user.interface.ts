import { Image } from "./image.interface";

export interface User {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  userId: string | null;
  username: string | null;
  imageUrl: string | null;
  email: string | null;
  phone: string | null;
  image?: Image | null;
}
