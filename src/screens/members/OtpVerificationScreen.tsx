import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Animated,
  Pressable,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Formik, FormikProps } from "formik";
import { Avatar, Portal, Snackbar, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { myNavigation, colors } from "@/utils";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/reduxs/apis/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ เพิ่ม import สำหรับแปลภาษา
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

const { width, height } = Dimensions.get("window");

type OtpVerificationRouteParams = {
  email: string;
  tempUserData: {
    name: string;
    email: string;
    password: string;
  };
};

type RouteProps = RouteProp<{ params: OtpVerificationRouteParams }, "params">;

type FormValues = {
  otp: string;
};

// Type definitions for API requests
type VerifyOtpRequest = {
  email: string;
  otp: string;
  type: string;
  userData?: {
    name: string;
    email: string;
    password: string;
  };
  ipAddress?: string;
  userAgent?: string;
};

type ResendOtpRequest = {
  email: string;
  type: string;
  ipAddress?: string;
  userAgent?: string;
};

const OtpVerificationScreen = () => {
  const { navigate, goBack } = myNavigation();
  const route = useRoute<RouteProps>();
  const { email, tempUserData } = route.params;

  const [verifyOtp, { isLoading: isVerifyLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ✅ ใช้ Context ภาษา
  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const otpInputAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  // OTP input refs
  const otpInputs = useRef<TextInput[]>([]);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const isLoading = isVerifyLoading || isResendLoading;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(otpInputAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Start countdown
    startCountdown();
  }, []);

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function for timer
    return () => clearInterval(timer);
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto focus previous input if backspace
    if (!value && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("");

    if (otpCode.length !== 6) {
      setSnackbarType("error");
      setSnackbarMessage(t("กรอกรหัส_OTP"));
      setSnackbarVisible(true);
      return;
    }

    try {
      const verifyOtpRequest: VerifyOtpRequest = {
        email: email,
        otp: otpCode,
        type: "REGISTRATION",
        userData: tempUserData,
      };

      const result = await verifyOtp(verifyOtpRequest).unwrap();

      if (
        result &&
        (result.success === true || (result as any).taskStatus === true)
      ) {
        // Save tokens if provided
        if ((result as any).data?.token) {
          await AsyncStorage.setItem(
            "accessToken",
            (result as any).data.token.accessToken
          );
          await AsyncStorage.setItem(
            "refreshToken",
            (result as any).data.token.refreshToken
          );

          // Save user data
          if ((result as any).data.user) {
            await AsyncStorage.setItem(
              "userData",
              JSON.stringify((result as any).data.user)
            );
          }
        }

        setSnackbarType("success");
        setSnackbarMessage("ยืนยัน OTP สำเร็จ! กำลังสร้างบัญชี...");
        setSnackbarVisible(true);

        setTimeout(() => {
          navigate("เข้าสู่ระบบ");
        }, 2000);
      } else {
        throw new Error(result?.message || "รหัส OTP ไม่ถูกต้อง");
      }
    } catch (error: any) {
      let errorMessage = "รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.errors && Array.isArray(error.data.errors)) {
        errorMessage = error.data.errors
          .map((err: any) => err.message || err)
          .join(", ");
      }

      if (errorMessage.includes("ไม่ถูกต้องหรือหมดอายุ")) {
        errorMessage = "รหัส OTP ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่";
      } else if (errorMessage.includes("เกินจำนวนครั้ง")) {
        errorMessage =
          "คุณได้พยายามใส่รหัส OTP ผิดเกินจำนวนครั้งที่กำหนด กรุณาขอรหัสใหม่";
      } else if (errorMessage.includes("required")) {
        errorMessage = "ข้อมูลไม่ครบถ้วน กรุณาลองใหม่อีกครั้ง";
      }

      setSnackbarType("error");
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);

      if (error?.status === 400) {
        setOtpValues(["", "", "", "", "", ""]);
        otpInputs.current[0]?.focus();
      }
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      const resendOtpRequest: ResendOtpRequest = {
        email: email,
        type: "REGISTRATION",
      };

      const result = await resendOtp(resendOtpRequest).unwrap();

      if (
        result &&
        (result.success === true || (result as any).taskStatus === true)
      ) {
        setSnackbarType("success");
        setSnackbarMessage("ส่งรหัส OTP ใหม่แล้ว กรุณาตรวจสอบอีเมลของคุณ");
        setSnackbarVisible(true);

        // Reset OTP inputs
        setOtpValues(["", "", "", "", "", ""]);
        otpInputs.current[0]?.focus();

        startCountdown();
      } else {
        throw new Error(
          result?.message || "เกิดข้อผิดพลาดในการส่งรหัส OTP ใหม่"
        );
      }
    } catch (error: any) {
      let errorMessage = "เกิดข้อผิดพลาดในการส่งรหัส OTP ใหม่";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      if (errorMessage.includes("รอ") && errorMessage.includes("วินาที")) {
        // Rate limit message - use as is
      } else if (errorMessage.includes("เกินจำนวนครั้ง")) {
        errorMessage = "คุณได้ขอรหัส OTP ใหม่เกินจำนวนครั้งที่กำหนดแล้ว";
      }

      setSnackbarType("error");
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          transform: [{ translateY: headerAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <BlurView intensity={20} tint="dark" style={styles.headerBlur} />

        <Animated.View
          style={[
            styles.backButtonContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Pressable onPress={goBack} style={styles.backButton}>
            <LinearGradient
              colors={[colors.white20, colors.white10]}
              style={styles.backButtonGradient}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <View style={styles.patternContainer}>
          {[...Array(15)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.patternDot,
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.1],
                  }),
                },
              ]}
            />
          ))}
        </View>

        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.headerTitle}>{t("ยืนยัน_OTP")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("กรุณากรอกรหัสยืนยันที่ส่งไปยัง")}
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          <View style={styles.headerDecoration}>
            <LinearGradient
              colors={[colors.accentGold, colors.accentGoldLight]}
              style={styles.decorativeLine}
            />
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );

  const renderLogo = () => (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          opacity: logoAnim,
          transform: [
            {
              translateY: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
            {
              scale: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={["#FFD700", "#FFA500"]}
        style={styles.logoGradient}
      >
        <Avatar.Image
          source={require("@/../assets/icon.png")}
          size={100}
          style={styles.logo}
        />
      </LinearGradient>
    </Animated.View>
  );

  const renderOtpInputs = () => (
    <Animated.View
      style={[
        styles.otpContainer,
        {
          opacity: otpInputAnim,
          transform: [
            {
              translateY: otpInputAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.otpTitle}>{t("กรอกรหัส_OTP")}</Text>
      <Text style={styles.otpSubtitle}>
        {t("รหัสยืนยัน_6_หลักที่ส่งไปยังอีเมลของคุณ")}
      </Text>

      <View style={styles.otpInputsRow}>
        {otpValues.map((value, index) => (
          <View key={index} style={styles.otpInputWrapper}>
            <LinearGradient
              colors={[colors.white, colors.backgroundCard]}
              style={styles.otpInputGradient}
            >
              <TextInput
                ref={(ref) => {
                  if (ref) otpInputs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={value}
                onChangeText={(text) => handleOtpChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
                editable={!isLoading}
              />
            </LinearGradient>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderButtons = () => (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          opacity: buttonAnim,
          transform: [
            {
              translateY: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Button
        mode="contained"
        onPress={handleVerifyOtp}
        style={styles.verifyButton}
        labelStyle={styles.buttonText}
        icon="check-circle"
        loading={isVerifyLoading}
        disabled={isLoading}
      >
        {isVerifyLoading ? t("กำลังยืนยัน") : t("ยืนยัน_OTP")}
      </Button>

      <View style={styles.resendContainer}>
        {!canResend ? (
          <Text style={styles.countdownText}>
            {t("ส่งรหัสใหม่ได้ใน")} {countdown} {t("วินาที")}
          </Text>
        ) : (
          <Button
            mode="outlined"
            onPress={handleResendOtp}
            style={styles.resendButton}
            labelStyle={styles.resendButtonText}
            icon="refresh"
            disabled={isLoading}
            loading={isResendLoading}
          >
            {isResendLoading ? t("กำลังส่ง") : t("ส่งรหัส_OTP_ใหม่")}
          </Button>
        )}
      </View>

      <Pressable
        onPress={goBack}
        style={styles.changeEmailLink}
        disabled={isLoading}
      >
        <Text style={styles.changeEmailText}>
          <Ionicons name="pencil" size={16} color={colors.primary} />{" "}
          {t("เปลี่ยนอีเมล")}
        </Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {renderHeader()}

          <Animated.View
            style={[
              styles.formWrapper,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {renderLogo()}
              {renderOtpInputs()}
              {renderButtons()}

              <View style={styles.bottomSpacer} />
            </ScrollView>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={[
            styles.snackbar,
            snackbarType === "success"
              ? styles.successSnackbar
              : styles.errorSnackbar,
          ]}
          action={{
            label: t("ตกลง"),
            onPress: () => setSnackbarVisible(false),
            textColor: colors.white,
          }}
        >
          <View style={styles.snackbarContent}>
            <Ionicons
              name={
                snackbarType === "success" ? "checkmark-circle" : "alert-circle"
              }
              size={20}
              color={colors.white}
            />
            <Text style={styles.snackbarText}>{snackbarMessage}</Text>
          </View>
        </Snackbar>
      </Portal>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },

  // Header styles
  header: {
    height: 200,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  headerBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  backButtonContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  backButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    opacity: 0.1,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
    margin: 12,
  },
  headerContent: {
    alignItems: "center",
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    textShadowColor: colors.black30,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.cream,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 5,
  },
  emailText: {
    fontSize: 14,
    color: colors.accentGold,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 15,
  },
  headerDecoration: {
    width: 60,
    height: 3,
  },
  decorativeLine: {
    flex: 1,
    borderRadius: 1.5,
  },

  // Form wrapper
  formWrapper: {
    flex: 1,
    marginTop: -20,
    backgroundColor: colors.backgroundMain,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },

  // Logo
  logoContainer: {
    alignItems: "center",
    marginVertical: 30,
    position: "relative",
  },
  logoGradient: {
    padding: 8,
    borderRadius: 60,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    backgroundColor: "transparent",
  },

  // OTP inputs
  otpContainer: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  otpInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInputWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  otpInputGradient: {
    borderRadius: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  otpInput: {
    height: 56,
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    backgroundColor: "transparent",
    borderRadius: 12,
  },

  // Buttons
  buttonContainer: {
    paddingHorizontal: 25,
    gap: 20,
  },
  verifyButton: {
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  resendContainer: {
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
  countdownText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  resendButton: {
    borderRadius: 16,
    borderColor: colors.primary,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  changeEmailLink: {
    alignItems: "center",
    paddingVertical: 12,
  },
  changeEmailText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },

  // Snackbar
  snackbar: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    margin: 16,
  },
  successSnackbar: {
    backgroundColor: colors.success,
  },
  errorSnackbar: {
    backgroundColor: colors.error,
  },
  snackbarContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  snackbarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },

  bottomSpacer: {
    height: 50,
  },
});
