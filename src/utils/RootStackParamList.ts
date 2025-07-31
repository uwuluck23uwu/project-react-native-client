import { Animal } from "@/interfaces/animal.interface";

export type DrawerParamList = {
    DrawerNavigator: undefined;
} & RootStackParamList;

export type RootStackParamList = {
    Main: undefined;

    สมาชิก: undefined;
    สมัครสมาชิก: undefined;
    เข้าสู่ระบบ: undefined;
    
    หน้าหลัก: undefined;
    รายละเอียด: { animal: Animal };
    ค้นหา: undefined;
    ตั๋ว: undefined;

    บริจาค: undefined;
    ชำระเงิน: {
        title?: string;
        price?: number;
        quantity?: number;
        ticketIds?: string[];
        animalId?: string;
        donationTypeId?: string;
    };
    เสร็จสิน: {
        title?: string;
    };
    ล้มเหลว: {
        title?: string;
    };

    การตั้งค่า: undefined;
    บัญชี: undefined;
};
