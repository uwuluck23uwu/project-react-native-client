import * as Yup from "yup";
import { checkDuplicate, checkCredentials } from "@/utils";

export const RegisterValidation = Yup.object().shape({
  name: Yup.string()
    .required("กรุณากรอกชื่อผู้ใช้")
    .test("unique-name", "ชื่อผู้ใช้นี้ถูกใช้แล้ว", async (value) => {
      if (!value) return true;
      return !(await checkDuplicate("name", value));
    }),
  email: Yup.string()
    .email("อีเมลไม่ถูกต้อง")
    .required("กรุณากรอกอีเมล")
    .test("unique-email", "อีเมลนี้ถูกใช้แล้ว", async (value) => {
      if (!value) return true;
      return !(await checkDuplicate("email", value));
    }),
  password: Yup.string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .required("กรุณากรอกรหัสผ่าน"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน")
    .required("กรุณากรอกยืนยันรหัสผ่าน"),
});

export const LoginValidation = Yup.object().shape({
  email: Yup.string()
    .email("อีเมลไม่ถูกต้อง")
    .required("กรุณากรอกอีเมล")
    .test("email-exists", "อีเมลนี้ไม่พบในระบบ", async (value) => {
      if (!value) return false;
      return await checkDuplicate("email", value);
    }),
  password: Yup.string()
    .required("กรุณากรอกรหัสผ่าน")
    .test("password-matches", "รหัสผ่านไม่ถูกต้อง", async function (password) {
      const email = this.parent.email;
      if (!email || !password) return false;
      return await checkCredentials(email, password);
    }),
});

export const PaymentValidation = Yup.object().shape({
  price: Yup.number()
    .typeError("กรุณากรอกตัวเลข")
    .positive("จำนวนเงินต้องมากกว่า 0")
    .required("กรุณากรอกจำนวนเงิน"),
});
