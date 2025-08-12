import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Paragraph } from "react-native-paper";
import { Icon } from "@/components";
import colors, { gradients } from "@/utils/colors";
import StackNavigation from "./StackNavigation";

const Tab = createBottomTabNavigator();
const { width: screenWidth } = Dimensions.get("window");

const tabConfigMap = {
  หน้าหลัก: {
    icon: "paw-outline",
    type: "Ionicons" as const,
    label: "สัตว์",
  },
  แผนที่: {
    icon: "map-marker-alt",
    type: "FontAwesome5" as const,
    label: "แผนที่",
  },
  ตั๋ว: {
    icon: "ticket-outline",
    type: "Ionicons" as const,
    label: "บัตร",
  },
  บัญชี: {
    icon: "settings-outline",
    type: "Ionicons" as const,
    label: "ตั้งค่า",
  },
} as const;

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const animatedValues = useRef(
    state.routes.map(() => ({
      scale: new Animated.Value(1),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0.6),
      iconScale: new Animated.Value(1),
    }))
  ).current;

  const backgroundPosition = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const tabWidth = screenWidth / state.routes.length;

  useEffect(() => {
    const activeIndex = state.index;

    Animated.parallel([
      Animated.spring(backgroundPosition, {
        toValue: activeIndex * tabWidth,
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
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: isActive ? -4 : 0,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: isActive ? 1 : 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(anim.iconScale, {
          toValue: isActive ? 1.1 : 1,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [state.index]);

  return (
    <View style={styles.tabBarContainer}>
      {Platform.OS === "ios" ? (
        <BlurView intensity={95} tint="light" style={styles.blurBackground} />
      ) : (
        <View style={styles.androidBackground} />
      )}

      <LinearGradient
        colors={[colors.white95, colors.backgroundMain]}
        style={styles.gradientOverlay}
      />
      <Animated.View
        style={[
          styles.activeTabBackground,
          {
            width: tabWidth - 20,
            left: backgroundPosition,
            marginLeft: 10,
          },
        ]}
      >
        <LinearGradient
          colors={gradients.goldenHour.colors}
          start={gradients.goldenHour.start}
          end={gradients.goldenHour.end}
          style={styles.activeGradient}
        />
        <Animated.View style={[styles.glowEffect, { opacity: glowOpacity }]}>
          <LinearGradient
            colors={[colors.glow, colors.primaryAlpha30]}
            style={styles.glowGradient}
          />
        </Animated.View>
      </Animated.View>

      <View style={styles.tabItemsContainer}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = tabConfigMap[route.name as keyof typeof tabConfigMap];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
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
                    styles.iconContainer,
                    {
                      transform: [{ scale: animatedValues[index].iconScale }],
                    },
                  ]}
                >
                  {isFocused && (
                    <View
                      style={{
                        position: "absolute",
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        backgroundColor: "#00000069",
                        zIndex: -1,
                      }}
                    />
                  )}
                  <Icon
                    type={tab.type}
                    icon={tab.icon}
                    size={isFocused ? 28 : 24}
                    color={isFocused ? colors.white : colors.bottomNavInactive}
                  />
                </Animated.View>
                <Paragraph
                  style={{
                    color: isFocused ? colors.white : colors.bottomNavInactive,
                    fontWeight: isFocused ? "bold" : "500",
                    fontSize: isFocused ? 12 : 11,
                    marginTop: -5,
                    marginBottom: 20,
                  }}
                >
                  {tab.label}
                </Paragraph>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
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
        name="บัญชี"
        initialParams={{ screen: "บัญชี" }}
        component={StackNavigation}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "relative",
    height: Platform.OS === "ios" ? 88 : 78,
    backgroundColor: "transparent",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  androidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white95, // ✅ แทน rgba ด้วย colors
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  activeTabBackground: {
    position: "absolute",
    top: 8,
    height: 60,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary, // ✅ ใช้สีจากธีม
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  activeGradient: {
    flex: 1,
    borderRadius: 20,
  },
  glowEffect: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 30,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 30,
  },
  tabItemsContainer: {
    flexDirection: "row",
    height: 64,
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  activeDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  dotGradient: {
    flex: 1,
    borderRadius: 4,
  },
});
