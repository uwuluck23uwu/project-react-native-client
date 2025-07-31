import type { Image } from "./image.interface";
import type { Habitat } from "./habitat.interface";

export interface Animal {
  animalId: string;
  habitatId: string;
  name: string;
  species: string;
  scientificName: string;
  description: string;
  locationCoordinates: string;
  status: string;
  dateOfBirth?: string;
  arrivalDate?: string;
  createdAt?: string;
  updatedAt?: string;
  habitat?: Habitat;
  images?: Image[];
}

export const AnimalStatus: Record<number, string> = {
  1: "สุขภาพดี",
  2: "ป่วย",
  3: "บาดเจ็บ",
  4: "กำลังพักฟื้น",
  5: "ถูกกักกัน",
  6: "เสียชีวิต",
};
