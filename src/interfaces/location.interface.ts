export interface Location {
  locationId: string;
  refId: string;
  name: string;
  x?: string;
  y?: string;
  description?: string;
  activities?: string;
}

export const Activities = {
  1: "ถ่ายรูป",
  2: "พักผ่อน",
  3: "สัตว์",
  4: "เรียนรู้",
  5: "เดินชม",
  6: "ซื้อของที่ระลึก",
  7: "รับประทานอาหาร/เครื่องดื่ม",
};
