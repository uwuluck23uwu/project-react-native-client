/**
 * Utility functions for OTP handling
 */

export interface OtpTimerConfig {
  initialTime: number;
  onTick: (timeLeft: number) => void;
  onComplete: () => void;
}

export class OtpTimer {
  private timerId: NodeJS.Timeout | null = null;
  private timeLeft: number = 0;
  private config: OtpTimerConfig;

  constructor(config: OtpTimerConfig) {
    this.config = config;
    this.timeLeft = config.initialTime;
  }

  start(): void {
    if (this.timerId) {
      this.stop();
    }

    this.timeLeft = this.config.initialTime;
    this.config.onTick(this.timeLeft);

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.config.onTick(this.timeLeft);

      if (this.timeLeft <= 0) {
        this.stop();
        this.config.onComplete();
      }
    }, 1000);
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  reset(): void {
    this.stop();
    this.timeLeft = this.config.initialTime;
    this.config.onTick(this.timeLeft);
  }

  getTimeLeft(): number {
    return this.timeLeft;
  }

  isRunning(): boolean {
    return this.timerId !== null;
  }
}

/**
 * Format time in seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Format time in seconds to readable text format
 */
export const formatTimeText = (seconds: number): string => {
  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
      return `${minutes} นาที`;
    } else {
      return `${minutes} นาที ${remainingSeconds} วินาที`;
    }
  } else {
    return `${seconds} วินาที`;
  }
};

/**
 * Validate OTP input - only allow digits
 */
export const validateOtpInput = (input: string): string => {
  return input.replace(/[^0-9]/g, "").slice(0, 1);
};

/**
 * Check if OTP is complete (all 6 digits filled)
 */
export const isOtpComplete = (otpValues: string[]): boolean => {
  return (
    otpValues.every((value) => value.length === 1) && otpValues.length === 6
  );
};

/**
 * Join OTP values into a single string
 */
export const joinOtpValues = (otpValues: string[]): string => {
  return otpValues.join("");
};

/**
 * Split OTP string into array of individual digits
 */
export const splitOtpString = (otpString: string): string[] => {
  const digits = otpString.slice(0, 6).split("");
  // Pad with empty strings if needed
  while (digits.length < 6) {
    digits.push("");
  }
  return digits;
};

/**
 * Clear all OTP input values
 */
export const clearOtpValues = (): string[] => {
  return ["", "", "", "", "", ""];
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Mask email for display (show first 3 chars and domain)
 */
export const maskEmail = (email: string): string => {
  if (!email || !isValidEmail(email)) {
    return email;
  }

  const [localPart, domain] = email.split("@");

  if (localPart.length <= 3) {
    return `${localPart}***@${domain}`;
  }

  const visiblePart = localPart.slice(0, 3);
  const hiddenLength = Math.min(localPart.length - 3, 5);
  const masked = "*".repeat(hiddenLength);

  return `${visiblePart}${masked}@${domain}`;
};

/**
 * Generate a random OTP for testing purposes
 * NOTE: This should only be used for development/testing
 */
export const generateTestOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * OTP validation patterns
 */
export const OTP_PATTERNS = {
  DIGITS_ONLY: /^[0-9]+$/,
  SIX_DIGITS: /^[0-9]{6}$/,
} as const;

/**
 * OTP configuration constants
 */
export const OTP_CONFIG = {
  LENGTH: 6,
  TIMER_DURATION: 60, // seconds
  MAX_RESEND_ATTEMPTS: 3,
  EXPIRY_TIME: 5 * 60, // 5 minutes in seconds
} as const;

/**
 * Error messages for OTP validation
 */
export const OTP_ERROR_MESSAGES = {
  INVALID_LENGTH: "กรุณากรอกรหัส OTP ให้ครบ 6 หลัก",
  INVALID_FORMAT: "รหัส OTP ต้องเป็นตัวเลขเท่านั้น",
  EXPIRED: "รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่",
  INVALID_CODE: "รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
  MAX_ATTEMPTS:
    "คุณได้ขอรหัส OTP เกินจำนวนครั้งที่กำหนด กรุณารอสักครู่แล้วลองใหม่",
  NETWORK_ERROR:
    "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ตและลองใหม่",
  SERVER_ERROR: "เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่ในภายหลัง",
} as const;

/**
 * Success messages for OTP operations
 */
export const OTP_SUCCESS_MESSAGES = {
  SENT: "ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว",
  RESENT: "ส่งรหัส OTP ใหม่แล้ว กรุณาตรวจสอบอีเมลของคุณ",
  VERIFIED: "ยืนยัน OTP สำเร็จ",
  ACCOUNT_CREATED: "สร้างบัญชีสำเร็จ กำลังเข้าสู่ระบบ",
} as const;

/**
 * Utility class for managing OTP state
 */
export class OtpManager {
  private otpValues: string[] = clearOtpValues();
  private timer: OtpTimer | null = null;
  private resendAttempts: number = 0;

  constructor(
    private onTimerTick: (timeLeft: number) => void,
    private onTimerComplete: () => void
  ) {}

  /**
   * Initialize the OTP manager with timer
   */
  initialize(): void {
    this.resetOtpValues();
    this.startTimer();
  }

  /**
   * Start the countdown timer
   */
  startTimer(): void {
    this.timer = new OtpTimer({
      initialTime: OTP_CONFIG.TIMER_DURATION,
      onTick: this.onTimerTick,
      onComplete: this.onTimerComplete,
    });
    this.timer.start();
  }

  /**
   * Stop the timer
   */
  stopTimer(): void {
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }
  }

  /**
   * Reset timer and start again
   */
  resetTimer(): void {
    this.stopTimer();
    this.startTimer();
  }

  /**
   * Set OTP value at specific index
   */
  setOtpValue(index: number, value: string): string[] {
    if (index >= 0 && index < OTP_CONFIG.LENGTH) {
      const validatedValue = validateOtpInput(value);
      this.otpValues[index] = validatedValue;
    }
    return [...this.otpValues];
  }

  /**
   * Get current OTP values
   */
  getOtpValues(): string[] {
    return [...this.otpValues];
  }

  /**
   * Get OTP as string
   */
  getOtpString(): string {
    return joinOtpValues(this.otpValues);
  }

  /**
   * Check if OTP is complete
   */
  isComplete(): boolean {
    return isOtpComplete(this.otpValues);
  }

  /**
   * Reset OTP values
   */
  resetOtpValues(): void {
    this.otpValues = clearOtpValues();
  }

  /**
   * Increment resend attempts
   */
  incrementResendAttempts(): number {
    return ++this.resendAttempts;
  }

  /**
   * Get current resend attempts
   */
  getResendAttempts(): number {
    return this.resendAttempts;
  }

  /**
   * Check if max resend attempts reached
   */
  hasReachedMaxResendAttempts(): boolean {
    return this.resendAttempts >= OTP_CONFIG.MAX_RESEND_ATTEMPTS;
  }

  /**
   * Reset resend attempts
   */
  resetResendAttempts(): void {
    this.resendAttempts = 0;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopTimer();
    this.resetOtpValues();
    this.resetResendAttempts();
  }
}
