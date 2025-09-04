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
import { BlurView } from "expo-blur";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Formik, FormikProps } from "formik";
import {
  TextInput,
  Avatar,
  Portal,
  Snackbar,
  Button,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@/components";
import { setCredentials } from "@/reduxs/slices/auth.slice";
import { LoginValidation } from "@/validations/validation";
import { useLoginMutation } from "@/reduxs/apis/auth.api";
import { myNavigation, colors } from "@/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

const { width, height } = Dimensions.get("window");

type FormValues = {
  identifier: string;
  password: string;
};

interface FormField {
  name: string;
  label: string;
  icon: string;
  iconLibrary: "Ionicons" | "MaterialCommunityIcons" | "Feather";
  isPassword?: boolean;
  keyboardType?: "default" | "email-address";
}

const getErrorMessage = (err: any): string => {
  const fromRtk = err?.data?.message || err?.data?.Message;
  let fromJson = "";
  try {
    const parsed = JSON.parse(err?.message || err?.error || "{}");
    fromJson = parsed?.data?.message || parsed?.message || "";
  } catch (_) {}
  if (err?.status === "FETCH_ERROR") return "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
  if (err?.status === 401)
    return fromRtk || fromJson || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  if (err?.status === 400)
    return fromRtk || fromJson || "ข้อมูลที่ส่งไม่ถูกต้อง";
  if (err?.status === 403) return fromRtk || fromJson || "ไม่มีสิทธิ์เข้าถึง";
  return fromRtk || fromJson || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง";
};

const decodeJwt = (token: string) => {
  const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  const json =
    typeof atob === "function"
      ? decodeURIComponent(escape(atob(b64)))
      : Buffer.from(b64, "base64").toString("utf8");
  return JSON.parse(json);
};

const LoginScreen = () => {
  const { navigate, goBack } = myNavigation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;

  const fieldAnimations = useRef(
    Array.from({ length: 2 }, () => new Animated.Value(0))
  ).current;

  const buttonAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const formFields: FormField[] = [
    {
      name: "identifier",
      label: t("อีเมลหรือชื่อผู้ใช้"),
      icon: "person-outline",
      iconLibrary: "Ionicons",
      keyboardType: "default",
    },
    {
      name: "password",
      label: t("รหัสผ่าน"),
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

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const handleLogin = async (values: {
    identifier: string;
    password: string;
  }) => {
    try {
      const res = await login({
        identifier: values.identifier,
        password: values.password,
      }).unwrap();

      const accessToken =
        res?.data?.accessToken ??
        res?.data?.AccessToken ??
        res?.accessToken ??
        res?.AccessToken;
      const refreshToken =
        res?.data?.refreshToken ??
        res?.data?.RefreshToken ??
        res?.refreshToken ??
        res?.RefreshToken;

      if (!accessToken) throw new Error("ไม่พบ accessToken จากเซิร์ฟเวอร์");

      const payload = decodeJwt(accessToken);

      const userId = payload.sub ?? null;
      const username =
        payload.unique_name ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        payload.name ||
        null;
      const role =
        payload.role ||
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        null;
      const email = payload.email ?? null;
      const phone = payload.phone ?? null;
      const imageUrl = payload.image_url || null;

      dispatch(
        setCredentials({
          accessToken,
          refreshToken: refreshToken ?? undefined,
          userId,
          username,
          role,
          email,
          phone,
          imageUrl,
        })
      );

      setSnackbarType("success");
      setSnackbarMessage(t("เข้าสู่ระบบสำเร็จ"));
      setSnackbarVisible(true);

      setTimeout(() => navigate("หน้าหลัก"), 800);
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setSnackbarType("error");
      setSnackbarMessage(msg);
      setSnackbarVisible(true);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const renderFormField = (
    field: FormField,
    index: number,
    formik: FormikProps<FormValues>
  ) => {
    const { handleChange, handleBlur, values, errors, touched } = formik;

    const isPwd = !!field.isPassword;

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
                secureTextEntry={isPwd && !showPassword}
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
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={togglePasswordVisibility}
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

  const renderButtons = (handleSubmit: () => void) => (
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
        onPress={handleSubmit}
        style={styles.confirmButton}
        labelStyle={styles.buttonText}
        icon="account"
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? t("กำลังเข้าสู่ระบบ") : t("เข้าสู่ระบบ")}
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
        onPress={() => navigate("สมัครสมาชิก")}
        style={styles.registerLink}
        disabled={isLoading}
      >
        <Text style={styles.registerLinkText}>
          {t("ยังไม่มีบัญชี")}{" "}
          <Text style={styles.registerLinkHighlight}>{t("สมัครสมาชิก")}</Text>
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
                <Text style={styles.headerSubtitle}>เข้าสู่ระบบ</Text>
                <Text style={styles.welcomeText}>ยินดีต้อนรับกลับมา</Text>

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
                        scale: Animated.multiply(
                          logoAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                          pulseAnim
                        ),
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
                    size={140}
                    style={styles.logo}
                  />
                </LinearGradient>

                <View style={styles.logoGlow}>
                  <LinearGradient
                    colors={[colors.accentGold + "40", "transparent"]}
                    style={styles.logoGlowGradient}
                  />
                </View>

                {[...Array(6)].map((_, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.floatingParticle,
                      {
                        opacity: logoAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 0.6],
                        }),
                        transform: [
                          {
                            translateX: Math.cos(i * 60 * (Math.PI / 180)) * 80,
                          },
                          {
                            translateY: Math.sin(i * 60 * (Math.PI / 180)) * 80,
                          },
                          { scale: pulseAnim },
                        ],
                      },
                    ]}
                  />
                ))}
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
                  identifier: "",
                  password: "",
                }}
                validationSchema={LoginValidation}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleLogin}
              >
                {(formikProps) => (
                  <View style={styles.formContainer}>
                    {formFields.map((field, index) =>
                      renderFormField(field, index, formikProps)
                    )}

                    {renderButtons(formikProps.handleSubmit)}
                  </View>
                )}
              </Formik>

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

export default LoginScreen;

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

  // Header
  header: {
    height: 180,
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
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    textShadowColor: colors.black30,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: colors.cream,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.white70,
    textAlign: "center",
    opacity: 0.8,
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

  // Form
  formWrapper: {
    flex: 1,
    marginTop: -30,
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

  // Logo
  logoContainer: {
    alignItems: "center",
    marginVertical: 40,
    position: "relative",
    height: 200,
    justifyContent: "center",
  },
  logoGradient: {
    padding: 10,
    borderRadius: 80,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logo: {
    backgroundColor: "transparent",
  },
  logoGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -30,
    left: -30,
  },
  logoGlowGradient: {
    flex: 1,
    borderRadius: 100,
  },
  floatingParticle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentGold + "80",
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },

  // Welcome Message
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

  // Form Fields
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

  // Buttons
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

  // Register Link
  registerLink: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  registerLinkText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerLinkHighlight: {
    color: colors.primary,
    fontWeight: "600",
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
