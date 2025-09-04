import { News } from "@/interfaces/news.interface";
import { Event } from "@/interfaces/event.interface";
import { Animal } from "@/interfaces/animal.interface";
import { TempUserData } from "@/interfaces/user.interface";

export type DrawerParamList = {
  DrawerNavigator: undefined;
} & RootStackParamList;

export type RootStackParamList = {
  Main: undefined;

  สมาชิก: undefined;
  สมัครสมาชิก: undefined;
  เข้าสู่ระบบ: undefined;
  ยืนยันOTP: {
    email: string;
    tempUserData: TempUserData;
    fromResend?: boolean;
  };

  หน้าหลัก: undefined;
  รายละเอียด: {
    animal?: Animal;
    event?: Event;
    news?: News;
  };
  ค้นหา: undefined;

  แผนที่: undefined;

  ตั๋ว: undefined;
  บัตรของฉัน: undefined;
  สแกนบัตร: undefined;
  ชำระเงิน: {
    title?: string;
    price?: number;
    quantity?: number;
  };
  เสร็จสิน: {
    title?: string;
  };
  ล้มเหลว: {
    title?: string;
  };

  ตั้งค่า: undefined;
  บัญชี: undefined;
};
