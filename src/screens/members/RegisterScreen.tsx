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
} from "react-native";
import { Formik, FormikProps } from "formik";
import { TextInput, Avatar, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@/components";
import { useSendOtpMutation } from "@/reduxs/apis/auth.api";
import { myNavigation, colors } from "@/utils";
import { RegisterValidation } from "@/validations/validation";
import AlertModal from "@/components/modals/AlertModal";

// ✅ เพิ่มสำหรับการแปลภาษา
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

const { width, height } = Dimensions.get("window");

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface FormField {
  name: string;
  label: string;
  icon: string;
  iconLibrary: "Ionicons" | "MaterialCommunityIcons" | "Feather";
  isPassword?: boolean;
  keyboardType?: "default" | "email-address";
}

interface AlertState {
  visible: boolean;
  type: "success" | "error" | "warning" | "info" | "confirm";
  title: string;
  message: string;
}

const RegisterScreen = () => {
  const { navigate, goBack } = myNavigation();
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  // ✅ ใช้ Language Context และ Translation
  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

  // แทนที่ Snackbar state ด้วย AlertModal state
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;

  const fieldAnimations = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0))
  ).current;

  const buttonAnim = useRef(new Animated.Value(0)).current;

  // ✅ เปลี่ยนฉลากฟิลด์เป็นข้อความจาก t()
  const formFields: FormField[] = [
    {
      name: "name",
      label: t("ชื่อผู้ใช้"),
      icon: "person-outline",
      iconLibrary: "Ionicons",
    },
    {
      name: "email",
      label: t("อีเมล"),
      icon: "mail-outline",
      iconLibrary: "Ionicons",
      keyboardType: "email-address",
    },
    {
      name: "password",
      label: t("รหัสผ่าน"),
      icon: "lock-closed-outline",
      iconLibrary: "Ionicons",
      isPassword: true,
    },
    {
      name: "confirmPassword",
      label: t("ยืนยันรหัสผ่าน"),
      icon: "lock-closed-outline",
      iconLibrary: "Ionicons",
      isPassword: true,
    },
  ];

  useEffect(() => {
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
    ]).start();

    setTimeout(() => {
      const fieldAnimSequence = fieldAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: index * 150,
          useNativeDriver: true,
        })
      );

      Animated.stagger(100, [
        ...fieldAnimSequence,
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 500);
  }, []);

  const showAlert = (
    type: "success" | "error" | "warning" | "info" | "confirm",
    title: string,
    message: string
  ) => {
    setAlert({
      visible: true,
      type,
      title,
      message,
    });
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  const handleSendOtp = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    try {
      // ส่งข้อมูลครบถ้วน
      const result = await sendOtp({
        email: values.email,
        type: "REGISTRATION",
        name: values.name,
        password: values.password,
      }).unwrap();

      if (
        result &&
        (result.success === true ||
          (result as any).taskStatus === true ||
          (result.message &&
            result.message.includes("ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว")))
      ) {
        showAlert(
          "success",
          "ส่ง OTP สำเร็จ",
          "ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมล"
        );

        setTimeout(() => {
          hideAlert();
          navigate("ยืนยันOTP", {
            email: values.email,
            tempUserData: {
              name: values.name,
              email: values.email,
              password: values.password,
            },
          });
        }, 1500);
      }
    } catch (error: any) {
      let errorTitle = "เกิดข้อผิดพลาด";
      let errorMessage = "เกิดข้อผิดพลาดในการส่ง OTP";

      if (error?.data?.message) {
        errorMessage = error.data.message;

        if (errorMessage.includes("อีเมลนี้ถูกใช้งานแล้ว")) {
          errorTitle = "อีเมลซ้ำ";
        } else if (errorMessage.includes("ชื่อผู้ใช้นี้ถูกใช้งานแล้ว")) {
          errorTitle = "ชื่อผู้ใช้ซ้ำ";
        } else if (errorMessage.includes("เกินจำนวนครั้งที่กำหนด")) {
          errorTitle = "ขอ OTP บ่อยเกินไป";
        } else if (errorMessage.includes("กรุณารอ")) {
          errorTitle = "กรุณารอสักครู่";
        }
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      showAlert("error", errorTitle, errorMessage);
    }
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderFormField = (
    field: FormField,
    index: number,
    formik: FormikProps<FormValues>
  ) => {
    const { handleChange, handleBlur, values, errors, touched } = formik;
    const isPwd = !!field.isPassword;
    const pwdKey = field.name as "password" | "confirmPassword";

    return (
      <Animated.View
        key={field.name}
        style={[
          styles.fieldContainer,
          {
            opacity: fieldAnimations[index],
            transform: [
              {
                translateX: fieldAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              { scale: fieldAnimations[index] },
            ],
          },
        ]}
      >
        <View style={styles.inputWrapper}>
          <LinearGradient
            colors={[colors.white, colors.backgroundCard]}
            style={styles.inputGradient}
          >
            <View style={styles.inputIconContainer}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.inputIcon}
              >
                <Icon
                  type={field.iconLibrary}
                  icon={field.icon}
                  size={20}
                  color={colors.white}
                />
              </LinearGradient>
            </View>

            <View style={styles.textInputContainer}>
              <TextInput
                label={field.label}
                mode="flat"
                style={styles.textInput}
                contentStyle={styles.textInputContent}
                value={values[field.name as keyof FormValues] as string}
                onChangeText={handleChange(field.name)}
                onBlur={handleBlur(field.name)}
                error={Boolean(
                  touched[field.name as keyof FormValues] &&
                    errors[field.name as keyof FormValues]
                )}
                secureTextEntry={isPwd && !showPasswords[pwdKey]}
                keyboardType={field.keyboardType || "default"}
                autoCapitalize="none"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                theme={{
                  colors: {
                    primary: colors.primary,
                    background: "transparent",
                  },
                }}
                right={
                  isPwd ? (
                    <TextInput.Icon
                      icon={showPasswords[pwdKey] ? "eye-off" : "eye"}
                      onPress={() => togglePasswordVisibility(pwdKey)}
                      color={colors.textSecondary}
                    />
                  ) : undefined
                }
              />
            </View>
          </LinearGradient>

          {touched[field.name as keyof FormValues] &&
            errors[field.name as keyof FormValues] && (
              <Animated.View style={styles.errorContainer}>
                <LinearGradient
                  colors={[colors.errorLight, colors.error + "20"]}
                  style={styles.errorGradient}
                >
                  <Ionicons
                    name="alert-circle"
                    size={16}
                    color={colors.error}
                    style={styles.errorIcon}
                  />
                  <Text style={styles.errorText}>
                    {errors[field.name as keyof FormValues] as string}
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}
        </View>
      </Animated.View>
    );
  };

  const renderButtons = (onSubmit: () => void) => (
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
        onPress={onSubmit}
        style={styles.confirmButton}
        labelStyle={styles.buttonText}
        icon="send"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? t("กำลังส่ง_OTP") : t("ส่งรหัสยืนยัน")}
      </Button>

      <Button
        mode="outlined"
        onPress={goBack}
        style={styles.cancelButton}
        labelStyle={styles.cancelButtonText}
        icon="arrow-left"
        disabled={isLoading}
      >
        {t("ย้อนกลับ")}
      </Button>

      <Pressable
        onPress={() => navigate("เข้าสู่ระบบ")}
        style={styles.loginLink}
        disabled={isLoading}
      >
        <Text style={styles.loginLinkText}>
          {t("มีบัญชีอยู่แล้ว")}{" "}
          <Text style={styles.loginLinkHighlight}>{t("เข้าสู่ระบบ")}</Text>
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
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      color={colors.white}
                    />
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
                <Text style={styles.headerTitle}>Primo Piazza</Text>
                {/* ✅ ใช้ข้อความจาก translations */}
                <Text style={styles.headerSubtitle}>{t("สมัครสมาชิก")}</Text>

                <View style={styles.headerDecoration}>
                  <LinearGradient
                    colors={[colors.accentGold, colors.accentGoldLight]}
                    style={styles.decorativeLine}
                  />
                </View>
              </Animated.View>
            </LinearGradient>
          </Animated.View>

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
                    size={120}
                    style={styles.logo}
                  />
                </LinearGradient>

                <View style={styles.logoGlow}>
                  <LinearGradient
                    colors={[colors.accentGold + "30", "transparent"]}
                    style={styles.logoGlowGradient}
                  />
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.welcomeContainer,
                  {
                    opacity: logoAnim,
                    transform: [
                      {
                        translateY: logoAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.welcomeTitle}>{t("ยินดีต้อนรับ")}</Text>
                <Text style={styles.welcomeSubtitle}>
                  {t("ยินดีต้อนรับ_เข้าสู่โลกแห่งความมหัศจรรย์ของ")} Primo
                  Piazza
                </Text>
              </Animated.View>

              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={RegisterValidation}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleSendOtp}
              >
                {(formikProps) => (
                  <View style={styles.formContainer}>
                    {formFields.map((field, index) =>
                      renderFormField(field, index, formikProps)
                    )}

                    {renderButtons(
                      formikProps.handleSubmit as unknown as () => void
                    )}
                  </View>
                )}
              </Formik>

              <View style={styles.bottomSpacer} />
            </ScrollView>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onDismiss={hideAlert}
        buttons={[
          {
            text: t("ตกลง"),
            onPress: hideAlert,
            style: "default",
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default RegisterScreen;

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

  header: {
    height: 160,
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
  formContainer: {
    paddingHorizontal: 25,
  },

  logoContainer: {
    alignItems: "center",
    marginVertical: 30,
    position: "relative",
  },
  logoGradient: {
    padding: 8,
    borderRadius: 70,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    backgroundColor: "transparent",
  },
  logoGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    top: -20,
    left: -20,
  },
  logoGlowGradient: {
    flex: 1,
    borderRadius: 80,
  },

  welcomeContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 25,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  fieldContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
  },
  inputGradient: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputIconContainer: {
    padding: 8,
  },
  inputIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    flex: 1,
    marginLeft: 8,
  },
  textInput: {
    backgroundColor: "transparent",
    fontSize: 16,
  },
  textInputContent: {
    color: colors.textPrimary,
  },
  errorContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  errorGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: colors.error,
    fontWeight: "500",
  },

  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  confirmButton: {
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cancelButton: {
    borderRadius: 16,
    borderColor: colors.platinum,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },

  loginLink: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  loginLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLinkHighlight: {
    color: colors.primary,
    fontWeight: "600",
  },

  bottomSpacer: {
    height: 50,
  },
});
