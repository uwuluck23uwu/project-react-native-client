import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Text, Avatar, Surface } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  FadeInUp,
  BounceIn,
  SlideInLeft,
  SlideInRight,
  RotateInDownLeft,
  FlipInEasyX,
} from "react-native-reanimated";
import { Icon } from "@/components";
import { colors, myNavigation } from "@/utils";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ApplyScreen = () => {
  const { navigate } = myNavigation();

  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(100);
  const decorativeScale = useSharedValue(0);
  const shimmerTranslateX = useSharedValue(-SCREEN_WIDTH);

  useEffect(() => {
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 600 }),
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    logoRotate.value = withSequence(
      withTiming(360, { duration: 800 }),
      withTiming(0, { duration: 400 })
    );

    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    subtitleOpacity.value = withDelay(700, withTiming(1, { duration: 800 }));

    buttonsTranslateY.value = withDelay(
      1000,
      withSpring(0, { damping: 15, stiffness: 150 })
    );

    decorativeScale.value = withDelay(
      200,
      withSpring(1, { damping: 10, stiffness: 80 })
    );

    const shimmerLoop = () => {
      shimmerTranslateX.value = withSequence(
        withTiming(SCREEN_WIDTH, { duration: 2000 }),
        withDelay(3000, withTiming(-SCREEN_WIDTH, { duration: 0 }))
      );

      setTimeout(shimmerLoop, 5000);
    };
    shimmerLoop();
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: logoScale.value },
        { rotate: `${logoRotate.value}deg` },
      ],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [
        {
          translateY: interpolate(titleOpacity.value, [0, 1], [30, 0]),
        },
      ],
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
      transform: [
        {
          translateY: interpolate(subtitleOpacity.value, [0, 1], [20, 0]),
        },
      ],
    };
  });

  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: buttonsTranslateY.value }],
      opacity: interpolate(buttonsTranslateY.value, [100, 0], [0, 1]),
    };
  });

  const decorativeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: decorativeScale.value }],
      opacity: decorativeScale.value,
    };
  });

  const shimmerAnimatedStyle = useSharedValue(0);
  const shimmerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shimmerTranslateX.value }, { skewX: "-20deg" }],
    };
  });

  const handleRegisterPress = () => {
    logoScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    navigate("สมัครสมาชิก");
  };

  const handleLoginPress = () => {
    logoScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    navigate("เข้าสู่ระบบ");
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.accentGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Shimmer Effect */}
        <Animated.View style={[styles.shimmer, shimmerStyle]} />

        {/* Decorative Elements */}
        <Animated.View
          style={[styles.decorativeElements, decorativeAnimatedStyle]}
        >
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
          <View style={[styles.circle, styles.circle4]} />

          {/* Italian-themed decorative icons */}
          <Animated.View
            style={[styles.decorativeIcon, styles.icon1]}
            entering={RotateInDownLeft.delay(1200)}
          >
            <Text style={styles.decorativeEmoji}>🏛️</Text>
          </Animated.View>

          <Animated.View
            style={[styles.decorativeIcon, styles.icon2]}
            entering={BounceIn.delay(1400)}
          >
            <Text style={styles.decorativeEmoji}>🌿</Text>
          </Animated.View>

          <Animated.View
            style={[styles.decorativeIcon, styles.icon3]}
            entering={FlipInEasyX.delay(1600)}
          >
            <Text style={styles.decorativeEmoji}>🦌</Text>
          </Animated.View>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Surface style={styles.logoContainer} elevation={5}>
              <LinearGradient
                colors={[colors.white, colors.cream]}
                style={styles.logoGradient}
              >
                <Animated.View style={logoAnimatedStyle}>
                  <Avatar.Image
                    source={require("@/../assets/icon.png")}
                    size={120}
                    style={styles.logo}
                  />
                </Animated.View>
              </LinearGradient>
            </Surface>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Animated.Text style={[styles.title, titleAnimatedStyle]}>
              🏛️ Primo Piazza
            </Animated.Text>

            <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
              ยินดีต้อนรับสู่หมู่บ้านอิตาเลียน{"\n"}
              ประสบการณ์ที่แสนพิเศษรอคุณอยู่
            </Animated.Text>

            {/* Features List */}
            <Animated.View
              style={styles.featuresList}
              entering={FadeInUp.delay(1000)}
            >
              <View style={styles.featureItem}>
                <Icon
                  icon="check-circle"
                  type="MaterialCommunityIcons"
                  size={16}
                  color={colors.accentGold}
                />
                <Text style={styles.featureText}>จองตั๋วออนไลน์</Text>
              </View>

              <View style={styles.featureItem}>
                <Icon
                  icon="check-circle"
                  type="MaterialCommunityIcons"
                  size={16}
                  color={colors.accentGold}
                />
                <Text style={styles.featureText}>ข้อมูลกิจกรรมล่าสุด</Text>
              </View>
            </Animated.View>
          </View>

          {/* Buttons Section */}
          <Animated.View style={[styles.buttonSection, buttonsAnimatedStyle]}>
            {/* Register Button */}
            <AnimatedTouchableOpacity
              style={styles.registerButtonContainer}
              onPress={handleRegisterPress}
              activeOpacity={0.8}
              entering={SlideInLeft.delay(1200).springify()}
            >
              <LinearGradient
                colors={[colors.accentGold, colors.accentGoldDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.registerButton}
              >
                <Icon
                  icon="account-plus"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
                <Icon
                  icon="arrow-right"
                  type="MaterialCommunityIcons"
                  size={18}
                  color={colors.white}
                />
              </LinearGradient>
            </AnimatedTouchableOpacity>

            {/* Login Button */}
            <AnimatedTouchableOpacity
              style={styles.loginButtonContainer}
              onPress={handleLoginPress}
              activeOpacity={0.8}
              entering={SlideInRight.delay(1400).springify()}
            >
              <BlurView intensity={20} style={styles.loginBlur}>
                <Surface style={styles.loginButton} elevation={4}>
                  <Icon
                    icon="login"
                    type="MaterialCommunityIcons"
                    size={20}
                    color={colors.white}
                  />
                  <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
                  <Icon
                    icon="arrow-right"
                    type="MaterialCommunityIcons"
                    size={18}
                    color={colors.white}
                  />
                </Surface>
              </BlurView>
            </AnimatedTouchableOpacity>
          </Animated.View>
        </View>

        {/* Bottom Wave */}
        <View style={styles.waveContainer}>
          <LinearGradient
            colors={[colors.primaryAlpha50, colors.white30]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.wave}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default ApplyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.shimmer,
    width: 100,
  },

  // Decorative Elements
  decorativeElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    backgroundColor: colors.white10,
    borderRadius: 50,
  },
  circle1: {
    width: 120,
    height: 120,
    top: 50,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    top: 150,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: 200,
    right: 50,
  },
  circle4: {
    width: 40,
    height: 40,
    bottom: 100,
    left: 30,
  },
  decorativeIcon: {
    position: "absolute",
  },
  icon1: {
    top: 100,
    right: 40,
  },
  icon2: {
    top: 200,
    left: 40,
  },
  icon3: {
    bottom: 250,
    right: 80,
  },
  decorativeEmoji: {
    fontSize: 24,
    opacity: 0.6,
  },

  // Main Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    justifyContent: "space-between",
  },

  // Logo Section
  logoSection: {
    alignItems: "center",
    marginTop: 40,
  },
  logoContainer: {
    borderRadius: 80,
    padding: 20,
    backgroundColor: colors.white,
  },
  logoGradient: {
    borderRadius: 80,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    backgroundColor: "transparent",
  },

  // Title Section
  titleSection: {
    alignItems: "center",
    marginVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: colors.black40,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.cream,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    textShadowColor: colors.black30,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuresList: {
    alignItems: "flex-start",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.cream,
    marginLeft: 8,
  },

  // Button Section
  buttonSection: {
    paddingBottom: 40,
  },
  registerButtonContainer: {
    marginBottom: 16,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 6,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    flex: 1,
    textAlign: "center",
  },

  loginButtonContainer: {
    marginBottom: 20,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginBlur: {
    borderRadius: 30,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: colors.white20,
    gap: 12,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    flex: 1,
    textAlign: "center",
  },

  // Wave Effect
  waveContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
  wave: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
});
