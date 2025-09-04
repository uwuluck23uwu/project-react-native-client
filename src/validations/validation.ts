import * as Yup from "yup";

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

// OTP Validation Schemas

export const OtpValidation = Yup.object().shape({
  otp: Yup.string()
    .required("กรุณากรอกรหัส OTP")
    .length(6, "รหัส OTP ต้องมี 6 หลัก")
    .matches(/^[0-9]+$/, "รหัส OTP ต้องเป็นตัวเลขเท่านั้น"),
});

export const OtpSendValidation = Yup.object().shape({
  email: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  name: Yup.string()
    .min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
    .max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร")
    .matches(
      /^[A-Za-z0-9ก-๙\s._-]+$/,
      "ชื่อสามารถมีได้เฉพาะตัวอักษร ตัวเลข ช่องว่าง จุด ขีดล่าง และขีดกลางเท่านั้น"
    )
    .required("กรุณากรอกชื่อผู้ใช้"),
  password: Yup.string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .max(100, "รหัสผ่านต้องไม่เกิน 100 ตัวอักษร")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/, "รหัสผ่านต้องมีทั้งตัวอักษรและตัวเลข")
    .required("กรุณากรอกรหัสผ่าน"),
});

export const OtpResendValidation = Yup.object().shape({
  email: Yup.string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
});

export const OtpVerifyValidation = Yup.object().shape({
  email: Yup.string()
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .required("อีเมลจำเป็นสำหรับการยืนยัน OTP"),
  otp: Yup.string()
    .required("กรุณากรอกรหัส OTP")
    .length(6, "รหัส OTP ต้องมี 6 หลัก")
    .matches(/^[0-9]+$/, "รหัส OTP ต้องเป็นตัวเลขเท่านั้น"),
  userData: Yup.object()
    .shape({
      name: Yup.string().required("ข้อมูลชื่อผู้ใช้จำเป็นสำหรับการสมัครสมาชิก"),
      email: Yup.string()
        .email("รูปแบบอีเมลไม่ถูกต้อง")
        .required("ข้อมูลอีเมลจำเป็นสำหรับการสมัครสมาชิก"),
      password: Yup.string().required(
        "ข้อมูลรหัสผ่านจำเป็นสำหรับการสมัครสมาชิก"
      ),
    })
    .required("ข้อมูลผู้ใช้จำเป็นสำหรับการยืนยัน OTP"),
});

// Helper functions สำหรับตรวจสอบที่เข้มงวดขึ้น
const isValidEmail = (email: string): boolean => {
  if (!email) return false;

  // ตรวจสอบความยาวตาม RFC 5321
  if (email.length > 254) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [localPart, domainPart] = parts;

  // ตรวจสอบความยาวของ local part
  if (!localPart || localPart.length > 64) return false;

  // ตรวจสอบรูปแบบ email ที่เข้มงวด
  const strictEmailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!strictEmailRegex.test(email)) return false;

  // ตรวจสอบ domain part
  if (!domainPart || domainPart.length > 253) return false;
  if (
    domainPart.includes("..") ||
    domainPart.startsWith(".") ||
    domainPart.endsWith(".")
  )
    return false;
  if (domainPart.startsWith("-") || domainPart.endsWith("-")) return false;

  return true;
};

const isValidUsername = (name: string): boolean => {
  if (!name || name.length < 2 || name.length > 50) return false;

  // ตรวจสอบว่าไม่เริ่มหรือจบด้วยช่องว่าง
  if (name.trim() !== name) return false;

  // ตรวจสอบว่าไม่มีช่องว่างติดกันเกิน 1 ตัว
  if (/\s{2,}/.test(name)) return false;

  // ตรวจสอบอักขระที่อนุญาต
  if (!/^[A-Za-z0-9ก-๙\s._-]+$/.test(name)) return false;

  // ตรวจสอบว่าไม่เริ่มหรือจบด้วยอักขระพิเศษ
  if (/^[._-]|[._-]$/.test(name)) return false;

  // ตรวจสอบว่ามีอักขระที่เป็นตัวอักษรอย่างน้อย 1 ตัว
  if (!/[A-Za-zก-๙]/.test(name)) return false;

  return true;
};

const isValidPassword = (password: string): boolean => {
  if (!password || password.length < 6 || password.length > 100) return false;

  // ตรวจสอบว่าไม่มีช่องว่าง
  if (/\s/.test(password)) return false;

  // ต้องมีทั้งตัวอักษรและตัวเลข
  if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) return false;

  // ตรวจสอบอักขระที่อนุญาต
  if (!/^[A-Za-z\d@$!%*?&._-]+$/.test(password)) return false;

  return true;
};

// Registration Step 1 (Send OTP) Validation - ปรับปรุงแล้ว
export const RegisterValidation = Yup.object().shape({
  name: Yup.string()
    .test("valid-format", "ชื่อผู้ใช้ไม่ถูกต้อง", (value) => {
      if (!value) return false;
      return isValidUsername(value);
    })
    .test(
      "no-special-start-end",
      "ชื่อไม่สามารถเริ่มหรือจบด้วยอักขระพิเศษได้",
      (value) => {
        if (!value) return false;
        return !/^[._-]|[._-]$/.test(value);
      }
    )
    .test("has-letter", "ชื่อต้องมีตัวอักษรอย่างน้อย 1 ตัว", (value) => {
      if (!value) return false;
      return /[A-Za-zก-๙]/.test(value);
    })
    .test("no-multiple-spaces", "ไม่สามารถมีช่องว่างติดกันได้", (value) => {
      if (!value) return false;
      return !/\s{2,}/.test(value);
    })
    .required("กรุณากรอกชื่อผู้ใช้"),

  email: Yup.string()
    .test("valid-email-format", "รูปแบบอีเมลไม่ถูกต้อง", (value) => {
      if (!value) return false;
      return isValidEmail(value.toLowerCase());
    })
    .test("email-length", "อีเมลยาวเกินไป (สูงสุด 254 ตัวอักษร)", (value) => {
      if (!value) return false;
      return value.length <= 254;
    })
    .test(
      "local-part-length",
      "ส่วนแรกของอีเมลยาวเกินไป (สูงสุด 64 ตัวอักษร)",
      (value: any) => {
        if (!value) return false;
        const localPart = value.split("@")[0];
        return localPart && localPart.length <= 64;
      }
    )
    .test("domain-valid", "โดเมนของอีเมลไม่ถูกต้อง", (value: any) => {
      if (!value) return false;
      const parts = value.split("@");
      if (parts.length !== 2) return false;
      const domain = parts[1];
      return (
        domain &&
        !domain.includes("..") &&
        !domain.startsWith(".") &&
        !domain.endsWith(".")
      );
    })
    .required("กรุณากรอกอีเมล"),

  password: Yup.string()
    .test("valid-password", "รหัสผ่านไม่ถูกต้อง", (value) => {
      if (!value) return false;
      return isValidPassword(value);
    })
    .test("no-spaces", "รหัสผ่านไม่สามารถมีช่องว่างได้", (value) => {
      if (!value) return false;
      return !/\s/.test(value);
    })
    .test(
      "has-letter-and-number",
      "รหัสผ่านต้องมีทั้งตัวอักษรและตัวเลข",
      (value) => {
        if (!value) return false;
        return /^(?=.*[A-Za-z])(?=.*\d)/.test(value);
      }
    )
    .test("allowed-characters", "รหัสผ่านมีอักขระที่ไม่อนุญาต", (value) => {
      if (!value) return false;
      return /^[A-Za-z\d@$!%*?&._-]+$/.test(value);
    })
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .max(100, "รหัสผ่านต้องไม่เกิน 100 ตัวอักษร")
    .required("กรุณากรอกรหัสผ่าน"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "รหัสผ่านไม่ตรงกัน")
    .required("กรุณายืนยันรหัสผ่าน"),
});

// Custom validation functions for OTP
export const validateOtpInput = (
  otp: string
): { isValid: boolean; message?: string } => {
  if (!otp) {
    return { isValid: false, message: "กรุณากรอกรหัส OTP" };
  }

  if (otp.length !== 6) {
    return { isValid: false, message: "รหัส OTP ต้องมี 6 หลัก" };
  }

  if (!/^[0-9]+$/.test(otp)) {
    return { isValid: false, message: "รหัส OTP ต้องเป็นตัวเลขเท่านั้น" };
  }

  return { isValid: true };
};

export const validateEmailForOtp = (
  email: string
): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: "กรุณากรอกอีเมล" };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, message: "รูปแบบอีเมลไม่ถูกต้อง" };
  }

  return { isValid: true };
};

export const validateOtpArray = (
  otpValues: string[]
): { isValid: boolean; message?: string } => {
  if (!otpValues || otpValues.length !== 6) {
    return { isValid: false, message: "รหัส OTP ต้องมี 6 หลัก" };
  }

  const hasEmptyValue = otpValues.some((value) => !value);
  if (hasEmptyValue) {
    return { isValid: false, message: "กรุณากรอกรหัส OTP ให้ครบทุกช่อง" };
  }

  const hasInvalidValue = otpValues.some((value) => !/^[0-9]$/.test(value));
  if (hasInvalidValue) {
    return { isValid: false, message: "รหัส OTP ต้องเป็นตัวเลขเท่านั้น" };
  }

  return { isValid: true };
};
