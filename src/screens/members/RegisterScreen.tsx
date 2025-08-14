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
import { TextInput, Avatar, Portal, Snackbar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@/components";
import { RegisterValidation } from "@/validations/validation";
import { useRegisterMutation } from "@/reduxs/apis/auth.api";
import { myNavigation, colors } from "@/utils";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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

const RegisterScreen = () => {
  const { navigate, goBack } = myNavigation();
  const [register, { isLoading }] = useRegisterMutation();

  // State
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success"
  );

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;

  const fieldAnimations = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0))
  ).current;

  const buttonAnim = useRef(new Animated.Value(0)).current;

  const formFields: FormField[] = [
    {
      name: "name",
      label: "ชื่อผู้ใช้",
      icon: "person-outline",
      iconLibrary: "Ionicons",
    },
    {
      name: "email",
      label: "อีเมล",
      icon: "mail-outline",
      iconLibrary: "Ionicons",
      keyboardType: "email-address",
    },
    {
      name: "password",
      label: "รหัสผ่าน",
      icon: "lock-closed-outline",
      iconLibrary: "Ionicons",
      isPassword: true,
    },
    {
      name: "confirmPassword",
      label: "ยืนยันรหัสผ่าน",
      icon: "lock-closed-outline",
      iconLibrary: "Ionicons",
      isPassword: true,
    },
  ];

  useEffect(() => {
    // Entrance animation sequence
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

    // Stagger field animations
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

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    try {
      const { confirmPassword, ...payload } = values;
      await register(payload).unwrap();

      setSnackbarType("success");
      setSnackbarMessage("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      setSnackbarVisible(true);

      setTimeout(() => {
        navigate("เข้าสู่ระบบ");
      }, 2000);
    } catch (err: any) {
      console.error("สมัครไม่สำเร็จ:", err);
      setSnackbarType("error");
      setSnackbarMessage(
        err?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      );
      setSnackbarVisible(true);
    }
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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

        {/* Back Button */}
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

        {/* Decorative Pattern */}
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

        {/* Header Content */}
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
          <Text style={styles.headerSubtitle}>สมัครสมาชิกใหม่</Text>

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
          size={120}
          style={styles.logo}
        />
      </LinearGradient>

      {/* Logo Glow Effect */}
      <View style={styles.logoGlow}>
        <LinearGradient
          colors={[colors.accentGold + "30", "transparent"]}
          style={styles.logoGlowGradient}
        />
      </View>
    </Animated.View>
  );

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
      {/* Register Button */}
      <Pressable
        onPress={onSubmit}
        style={({ pressed }) => [
          styles.confirmButton,
          pressed && styles.buttonPressed,
        ]}
        disabled={isLoading}
      >
        <LinearGradient
          colors={
            isLoading
              ? [colors.disabled, colors.disabled]
              : [colors.primary, colors.primaryDark]
          }
          style={styles.confirmButtonGradient}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Animated.View style={styles.loadingSpinner}>
                <Ionicons name="refresh" size={20} color={colors.white} />
              </Animated.View>
              <Text style={styles.buttonText}>กำลังสมัคร...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="person-add" size={20} color={colors.white} />
              <Text style={styles.buttonText}>สมัครสมาชิก</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>

      {/* Cancel Button */}
      <Pressable
        onPress={goBack}
        style={({ pressed }) => [
          styles.cancelButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <LinearGradient
          colors={[colors.white, colors.backgroundCard]}
          style={styles.cancelButtonGradient}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
          <Text style={styles.cancelButtonText}>ย้อนกลับ</Text>
        </LinearGradient>
      </Pressable>

      {/* Login Link */}
      <Pressable
        onPress={() => navigate("เข้าสู่ระบบ")}
        style={styles.loginLink}
      >
        <Text style={styles.loginLinkText}>
          มีบัญชีอยู่แล้ว?{" "}
          <Text style={styles.loginLinkHighlight}>เข้าสู่ระบบ</Text>
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
                onSubmit={handleRegister}
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

      {/* Success/Error Snackbar */}
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
            label: "ตกลง",
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

  // Header
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

  // Form
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

  // Logo
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
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  cancelButton: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  cancelButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 10,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingSpinner: {
    // Add rotation animation here if needed
  },

  // Login Link
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
