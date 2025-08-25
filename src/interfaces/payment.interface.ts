import { IconType } from "@/components/Icon";

export interface Payment {
  id: string;
  name: string;
  icon: string;
  iconType: IconType;
  color: string;
  description: string;
}
