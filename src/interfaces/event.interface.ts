import type { Image } from "./image.interface";

export interface Event {
  eventId: string;
  title: string;
  description: string;
  location: string;
  locationCoordinates: string;
  status: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
  images?: Image[];
}

export const EventStatus = {
  1: "กำลังจะจัดขึ้น",
  2: "กิจกรรมได้เริ่มขึ้นแล้ว",
  3: "สิ้นสุดกิจกรรม",
  4: "ยกเลิกกิจกรรม",
  5: "เลื่อนกำหนดการ",
};
