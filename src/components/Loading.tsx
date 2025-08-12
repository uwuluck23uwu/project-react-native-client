import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import colors, { gradients } from "@/utils/colors";

const { width } = Dimensions.get("window");

const ModernLoading = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    Animated.timing(textFadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    const dotsLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(dotsAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    rotateLoop.start();
    floatLoop.start();
    shimmerLoop.start();
    dotsLoop.start();

    return () => {
      pulseLoop.stop();
      rotateLoop.stop();
      floatLoop.stop();
      shimmerLoop.stop();
      dotsLoop.stop();
    };
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const floatInterpolate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const dotsOpacity = dotsAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.italianSunset.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.backgroundElements}>
          <Animated.View
            style={[
              styles.floatingCircle,
              styles.circle1,
              {
                transform: [
                  { translateY: floatInterpolate },
                  { scale: pulseAnim },
                ],
                opacity: fadeAnim,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.floatingCircle,
              styles.circle2,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 15],
                    }),
                  },
                  {
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [1.1, 1],
                    }),
                  },
                ],
                opacity: fadeAnim,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.floatingCircle,
              styles.circle3,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
                opacity: fadeAnim,
              },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslateX }],
              opacity: fadeAnim,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.lottieContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LottieView
              source={require("@/../assets/animations/loading.json")}
              autoPlay
              loop
              style={styles.animation}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textFadeAnim,
                transform: [{ translateY: floatInterpolate }],
              },
            ]}
          >
            <Text style={styles.title}>Primo Piazza</Text>
            <Text style={styles.subtitle}>สัมผัสอิตาลีใจกลางเมืองไทย</Text>

            <Animated.View
              style={[styles.dotsContainer, { opacity: dotsOpacity }]}
            >
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </Animated.View>

            <Text style={styles.loadingText}>กำลังโหลด...</Text>
          </Animated.View>
        </Animated.View>

        <View style={styles.bottomWave}>
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [
                  {
                    translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 50],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default ModernLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: "relative",
  },
  backgroundElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingCircle: {
    position: "absolute",
    backgroundColor: colors.primaryAlpha10,
    borderRadius: 50,
  },
  circle1: {
    width: 120,
    height: 120,
    top: 100,
    right: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    top: 200,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: 150,
    right: 50,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white20,
    transform: [{ skewX: "-20deg" }],
    width: 100,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  lottieContainer: {
    marginVertical: 20,
  },
  animation: {
    width: 400,
    height: 400,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 5,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryDark,
    textAlign: "center",
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.accentGoldLight,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textTertiary,
    textAlign: "center",
    fontWeight: "500",
  },
  bottomWave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: "hidden",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: -50,
    right: -50,
    height: 100,
    backgroundColor: colors.white20,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
});
