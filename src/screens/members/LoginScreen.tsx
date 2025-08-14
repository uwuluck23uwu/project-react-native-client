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
import { LoginValidation } from "@/validations/validation";
import { useLoginMutation } from "@/reduxs/apis/auth.api";
import { myNavigation, colors } from "@/utils";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type FormValues = {
  email: string;
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

const LoginScreen = () => {
  const { navigate, goBack } = myNavigation();
  const [login, { isLoading }] = useLoginMutation();

  // State
  const [showPassword, setShowPassword] = useState(false);
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
    Array.from({ length: 2 }, () => new Animated.Value(0))
  ).current;

  const buttonAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const formFields: FormField[] = [
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

    // Continuous pulse animation for logo
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

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values).unwrap();

      setSnackbarType("success");
      setSnackbarMessage("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ");
      setSnackbarVisible(true);

      setTimeout(() => {
        navigate("หน้าหลัก");
      }, 1500);
    } catch (err: any) {
      console.error("เข้าสู่ระบบไม่สำเร็จ:", err);
      setSnackbarType("error");
      setSnackbarMessage(err?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      setSnackbarVisible(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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

      {/* Logo Glow Effect */}
      <View style={styles.logoGlow}>
        <LinearGradient
          colors={[colors.accentGold + "40", "transparent"]}
          style={styles.logoGlowGradient}
        />
      </View>

      {/* Floating particles around logo */}
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
  );

  const renderWelcomeMessage = () => (
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
      <Text style={styles.welcomeTitle}>ยินดีต้อนรับ</Text>
      <Text style={styles.welcomeSubtitle}>
        เข้าสู่โลกแห่งความมหัศจรรย์ของ Primo Piazza
      </Text>
    </Animated.View>
  );

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
      {/* Login Button */}
      <Pressable
        onPress={handleSubmit}
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
              <Animated.View
                style={[
                  styles.loadingSpinner,
                  {
                    transform: [
                      {
                        rotate: pulseAnim.interpolate({
                          inputRange: [1, 1.05],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons name="refresh" size={20} color={colors.white} />
              </Animated.View>
              <Text style={styles.buttonText}>กำลังเข้าสู่ระบบ...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="log-in" size={20} color={colors.white} />
              <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
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

      {/* Register Link */}
      <Pressable
        onPress={() => navigate("สมัครสมาชิก")}
        style={styles.registerLink}
      >
        <Text style={styles.registerLinkText}>
          ยังไม่มีบัญชี?{" "}
          <Text style={styles.registerLinkHighlight}>สมัครสมาชิก</Text>
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
              {renderWelcomeMessage()}

              <Formik
                initialValues={{
                  email: "",
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
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
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
    // Rotation animation applied in component
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
