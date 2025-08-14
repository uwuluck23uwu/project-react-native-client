import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
import { BlurView } from "expo-blur";
import { Paragraph } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@/components";
import colors, { gradients } from "@/utils/colors";
import StackNavigation from "./StackNavigation";

const Tab = createBottomTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const tabConfigMap = {
  หน้าหลัก: {
    icon: "paw-outline",
    type: "Ionicons" as const,
    label: "สัตว์",
    gradient: ["#FF6B6B", "#FF8E53"],
  },
  แผนที่: {
    icon: "map-marker-alt",
    type: "FontAwesome5" as const,
    label: "แผนที่",
    gradient: ["#4facfe", "#00f2fe"],
  },
  ตั๋ว: {
    icon: "ticket-outline",
    type: "Ionicons" as const,
    label: "บัตร",
    gradient: ["#43e97b", "#38f9d7"],
  },
  ตั้งค่า: {
    icon: "settings-outline",
    type: "Ionicons" as const,
    label: "ตั้งค่า",
    gradient: ["#fa709a", "#fee140"],
  },
} as const;

const WaveShape = () => {
  return (
    <Svg
      height="20"
      width={screenWidth}
      viewBox={`0 0 ${screenWidth} 20`}
      style={styles.wave}
    >
      <Defs>
        <SvgGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={colors.accentGold} stopOpacity="0.8" />
          <Stop
            offset="50%"
            stopColor={colors.accentTerracotta}
            stopOpacity="0.6"
          />
          <Stop offset="100%" stopColor={colors.accentGold} stopOpacity="0.8" />
        </SvgGradient>
      </Defs>
      <Path
        d={`M 0 10 Q ${screenWidth / 4} 0 ${
          screenWidth / 2
        } 10 T ${screenWidth} 10 L ${screenWidth} 20 L 0 20 Z`}
        fill="url(#waveGradient)"
      />
    </Svg>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const animatedValues = useRef(
    state.routes.map(() => ({
      scale: new Animated.Value(1),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0.6),
      iconScale: new Animated.Value(1),
      ripple: new Animated.Value(0),
    }))
  ).current;

  const backgroundPosition = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = screenWidth / state.routes.length;

  useEffect(() => {
    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    );
    waveLoop.start();

    return () => waveLoop.stop();
  }, []);

  useEffect(() => {
    const activeIndex = state.index;

    Animated.parallel([
      Animated.spring(backgroundPosition, {
        toValue: activeIndex * tabWidth,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    animatedValues.forEach((anim: any, index: any) => {
      const isActive = index === activeIndex;

      Animated.parallel([
        Animated.spring(anim.scale, {
          toValue: isActive ? 1.1 : 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: isActive ? -8 : 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: isActive ? 1 : 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(anim.iconScale, {
          toValue: isActive ? 1.2 : 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(anim.ripple, {
            toValue: isActive ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  }, [state.index]);

  const handleTabPress = (route: any, index: number) => {
    Animated.sequence([
      Animated.timing(animatedValues[index].ripple, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[index].ripple, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {Platform.OS === "ios" ? (
        <BlurView
          intensity={100}
          tint="systemUltraThinMaterialLight"
          style={styles.blurBackground}
        />
      ) : (
        <View style={styles.androidBackground} />
      )}

      <LinearGradient
        colors={[colors.white95, colors.backgroundMain, colors.white90]}
        style={styles.gradientOverlay}
      />

      <WaveShape />

      <Animated.View
        style={[
          styles.activeTabBackground,
          {
            width: tabWidth - 16,
            left: backgroundPosition,
            marginLeft: 8,
          },
        ]}
      >
        <LinearGradient
          colors={
            tabConfigMap[
              state.routes[state.index].name as keyof typeof tabConfigMap
            ]?.gradient || gradients.goldenHour.colors
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.activeGradient}
        />

        <Animated.View style={[styles.glowEffect, { opacity: glowOpacity }]}>
          <LinearGradient
            colors={[colors.glow, "transparent", colors.glow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.glowGradient}
          />
        </Animated.View>
      </Animated.View>

      <View style={styles.tabItemsContainer}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = tabConfigMap[route.name as keyof typeof tabConfigMap];

          const rippleScale = animatedValues[index].ripple.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.5],
          });

          const rippleOpacity = animatedValues[index].ripple.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.3, 0],
          });

          return (
            <Pressable
              key={route.key}
              onPress={() => handleTabPress(route, index)}
              style={styles.tabItem}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    transform: [
                      { scale: animatedValues[index].scale },
                      { translateY: animatedValues[index].translateY },
                    ],
                    opacity: animatedValues[index].opacity,
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.rippleEffect,
                    {
                      transform: [{ scale: rippleScale }],
                      opacity: rippleOpacity,
                    },
                  ]}
                />

                <Animated.View
                  style={[
                    styles.iconContainer,
                    {
                      transform: [{ scale: animatedValues[index].iconScale }],
                    },
                  ]}
                >
                  {isFocused && (
                    <View style={styles.activeIconBackground}>
                      <LinearGradient
                        colors={["rgba(0,0,0,0.2)", "transparent"]}
                        style={styles.iconBackgroundGradient}
                      />
                    </View>
                  )}

                  <Icon
                    type={tab.type}
                    icon={tab.icon}
                    size={isFocused ? 26 : 22}
                    color={isFocused ? colors.white : colors.bottomNavInactive}
                  />

                  {isFocused && (
                    <View style={styles.activeDot}>
                      <LinearGradient
                        colors={tab.gradient}
                        style={styles.activeDotGradient}
                      />
                    </View>
                  )}
                </Animated.View>

                <Animated.View style={styles.labelContainer}>
                  <Paragraph
                    style={[
                      styles.tabLabel,
                      {
                        color: isFocused
                          ? colors.white
                          : colors.bottomNavInactive,
                        fontWeight: isFocused ? "bold" : "500",
                        fontSize: isFocused ? 11 : 10,
                      },
                    ]}
                  >
                    {tab.label}
                  </Paragraph>
                </Animated.View>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
      {Platform.OS === "ios" && <View style={styles.bottomSafeArea} />}
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="หน้าหลัก"
        initialParams={{ screen: "หน้าหลัก" }}
        component={StackNavigation}
      />
      <Tab.Screen
        name="แผนที่"
        initialParams={{ screen: "แผนที่" }}
        component={StackNavigation}
      />
      <Tab.Screen
        name="ตั๋ว"
        initialParams={{ screen: "ตั๋ว" }}
        component={StackNavigation}
      />
      <Tab.Screen
        name="ตั้งค่า"
        initialParams={{ screen: "ตั้งค่า" }}
        component={StackNavigation}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "relative",
    height: Platform.OS === "ios" ? 98 : 85,
    backgroundColor: "transparent",
    elevation: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white95,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  wave: {
    position: "absolute",
    top: 0,
  },
  activeTabBackground: {
    position: "absolute",
    top: 12,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  activeGradient: {
    flex: 1,
    borderRadius: 26,
  },
  glowEffect: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 30,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 30,
  },
  tabItemsContainer: {
    flexDirection: "row",
    height: 70,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    position: "relative",
  },
  rippleEffect: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white30,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  activeIconBackground: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  iconBackgroundGradient: {
    flex: 1,
    borderRadius: 22,
  },
  activeDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.white,
  },
  activeDotGradient: {
    flex: 1,
    borderRadius: 4,
  },
  labelContainer: {
    minHeight: 14,
    marginBottom: 14,
    justifyContent: "center",
  },
  tabLabel: {
    textAlign: "center",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fabContainer: {
    position: "absolute",
    top: -25,
    right: 20,
    zIndex: 1000,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSafeArea: {
    height: 20,
    backgroundColor: colors.backgroundMain,
  },
});
