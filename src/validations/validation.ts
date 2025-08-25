import * as Yup from "yup";

export const RegisterValidation = Yup.object().shape({
  name: Yup.string().required("กรุณากรอกชื่อผู้ใช้"),
  email: Yup.string().email("อีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  password: Yup.string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .required("กรุณากรอกรหัสผ่าน"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "รหัสผ่านไม่ตรงกัน")
    .required("กรุณายืนยันรหัสผ่าน"),
});

export const LoginValidation = Yup.object().shape({
  identifier: Yup.string()
    .required("กรุณากรอกอีเมลหรือชื่อผู้ใช้")
    .test("email-or-username", "อีเมลหรือชื่อผู้ใช้ไม่ถูกต้อง", (v) => {
      if (!v) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[A-Za-z0-9._-]{3,}$/;
      return emailRegex.test(v) || usernameRegex.test(v);
    }),
  password: Yup.string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .required("กรุณากรอกรหัสผ่าน"),
});

export const PaymentValidation = Yup.object().shape({
  price: Yup.number()
    .typeError("กรุณากรอกตัวเลข")
    .positive("จำนวนเงินต้องมากกว่า 0")
    .required("กรุณากรอกจำนวนเงิน"),
});
