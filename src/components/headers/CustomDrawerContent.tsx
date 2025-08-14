import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  StatusBar,
  Dimensions,
  ColorValue,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Icon } from "@/components";
import colors, { gradients } from "@/utils/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface DrawerItemData {
  label: string;
  icon: string;
  route: string;
  screen: string;
  iconLibrary: "Ionicons" | "MaterialCommunityIcons";
  gradient?:
    | readonly [ColorValue, ColorValue]
    | readonly [ColorValue, ColorValue, ColorValue];
}

const menuItems: DrawerItemData[] = [
  {
    label: "หน้าหลัก",
    icon: "home-outline",
    route: "Main",
    screen: "หน้าหลัก",
    iconLibrary: "Ionicons",
    gradient: ["#FF6B6B", "#FFE66D"],
  },
  {
    label: "แผนที่",
    icon: "map-outline",
    route: "Main",
    screen: "แผนที่",
    iconLibrary: "Ionicons",
    gradient: ["#4ECDC4", "#44A08D"],
  },
  {
    label: "ตั๋ว",
    icon: "ticket-outline",
    route: "Main",
    screen: "ตั๋ว",
    iconLibrary: "Ionicons",
    gradient: ["#FFD700", "#FFA500"],
  },
  {
    label: "ร้านอาหาร",
    icon: "silverware-fork-knife",
    route: "Main",
    screen: "ร้านอาหาร",
    iconLibrary: "MaterialCommunityIcons",
    gradient: ["#FF8A65", "#FF7043"],
  },
  {
    label: "กิจกรรม",
    icon: "calendar-heart",
    route: "Main",
    screen: "กิจกรรม",
    iconLibrary: "MaterialCommunityIcons",
    gradient: ["#9C27B0", "#E91E63"],
  },
  {
    label: "แกลเลอรี",
    icon: "image-multiple-outline",
    route: "Main",
    screen: "แกลเลอรี",
    iconLibrary: "MaterialCommunityIcons",
    gradient: ["#673AB7", "#3F51B5"],
  },
];

const settingsItems: DrawerItemData[] = [
  {
    label: "บัญชีของฉัน",
    icon: "person-outline",
    route: "Main",
    screen: "บัญชี",
    iconLibrary: "Ionicons",
    gradient: ["#2196F3", "#21CBF3"],
  },
  {
    label: "ตั้งค่า",
    icon: "settings-outline",
    route: "Main",
    screen: "ตั้งค่า",
    iconLibrary: "Ionicons",
    gradient: ["#607D8B", "#90A4AE"],
  },
];

const CustomDrawerContent = (props: any) => {
  const { navigation, state } = props;
  const [activeItem, setActiveItem] = useState(
    state?.routeNames[state?.index] || "หน้าหลัก"
  );

  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const headerAnim = useRef(new Animated.Value(-100)).current;

  const itemAnimations = useRef(
    [...menuItems, ...settingsItems].map(() => new Animated.Value(0))
  ).current;

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
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const itemAnimSequence = itemAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, itemAnimSequence).start();
  }, []);

  const handleItemPress = (item: DrawerItemData) => {
    setActiveItem(item.screen);

    const pressedIndex = [...menuItems, ...settingsItems].findIndex(
      (menuItem) => menuItem.screen === item.screen
    );

    if (pressedIndex !== -1) {
      Animated.sequence([
        Animated.timing(itemAnimations[pressedIndex], {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemAnimations[pressedIndex], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    navigation.navigate(item.route, { screen: item.screen });
  };

  const renderDrawerItem = (item: DrawerItemData, index: number) => {
    const isActive = activeItem === item.screen;
    const IconComponent =
      item.iconLibrary === "Ionicons" ? Ionicons : MaterialCommunityIcons;
    const animationIndex = index;

    return (
      <Animated.View
        key={item.screen}
        style={[
          styles.drawerItemContainer,
          {
            opacity: itemAnimations[animationIndex],
            transform: [
              {
                translateX: itemAnimations[animationIndex].interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
              {
                scale: itemAnimations[animationIndex],
              },
            ],
          },
        ]}
      >
        <Pressable
          onPress={() => handleItemPress(item)}
          style={({ pressed }) => [
            styles.drawerItem,
            isActive && styles.activeDrawerItem,
            pressed && styles.pressedDrawerItem,
          ]}
        >
          {isActive && (
            <LinearGradient
              colors={item.gradient || [colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.activeGradient}
            />
          )}

          <View
            style={[
              styles.iconContainer,
              isActive && styles.activeIconContainer,
            ]}
          >
            <Icon
              type={item.iconLibrary}
              icon={item.icon as any}
              size={24}
              color={isActive ? colors.white : colors.textSecondary}
            />
          </View>

          <Text
            style={[styles.drawerLabel, isActive && styles.activeDrawerLabel]}
          >
            {item.label}
          </Text>

          {isActive && (
            <Animated.View style={styles.activeIndicator}>
              <LinearGradient
                colors={["#FFD700", "#FFA500"]}
                style={styles.indicatorGradient}
              />
            </Animated.View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={gradients.tuscanHills.colors}
          start={gradients.tuscanHills.start}
          end={gradients.tuscanHills.end}
          style={styles.headerGradient}
        >
          <BlurView intensity={20} tint="dark" style={styles.blurOverlay} />

          <View style={styles.patternContainer}>
            {[...Array(20)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.patternDot,
                  {
                    opacity: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.1],
                    }),
                    transform: [
                      {
                        scale: scaleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
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
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={["#FFD700", "#FFA500"]}
                style={styles.logoGradient}
              >
                <Icon
                  type="MaterialCommunityIcons"
                  icon="castle"
                  size={40}
                  color={colors.white}
                />
              </LinearGradient>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Primo Piazza</Text>
              <Text style={styles.subtitle}>สัมผัสอิตาลีที่เขาใหญ่</Text>
            </View>

            <View style={styles.decorativeContainer}>
              <LinearGradient
                colors={["rgba(255,215,0,0.3)", "transparent"]}
                style={styles.decorativeLine}
              />
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.menuContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>เมนูหลัก</Text>
            <View style={styles.sectionDivider}>
              <LinearGradient
                colors={[colors.accentGold, colors.accentGoldLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dividerGradient}
              />
            </View>

            {menuItems.map((item, index) => renderDrawerItem(item, index))}
          </View>

          <View style={styles.mainDivider}>
            <LinearGradient
              colors={[colors.platinum, colors.silver, colors.platinum]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.dividerLine}
            />
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>การตั้งค่า</Text>
            <View style={styles.sectionDivider}>
              <LinearGradient
                colors={[colors.accentTerracotta, colors.accentTerracottaLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.dividerGradient}
              />
            </View>

            {settingsItems.map((item, index) =>
              renderDrawerItem(item, menuItems.length + index)
            )}
          </View>

          <Animated.View
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.white10, colors.white05]}
              style={styles.footerGradient}
            >
              <Text style={styles.footerText}>เวอร์ชัน 1.0.0</Text>
              <Text style={styles.footerSubtext}>
                สร้างด้วย ❤️ เพื่อ Primo Piazza
              </Text>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },

  header: {
    height: 200,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    margin: 15,
  },
  headerContent: {
    alignItems: "center",
    zIndex: 1,
  },
  logoContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  titleContainer: {
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    textShadowColor: colors.black30,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.cream,
    textAlign: "center",
    marginTop: 5,
    opacity: 0.9,
    fontStyle: "italic",
  },
  decorativeContainer: {
    marginTop: 15,
    width: "60%",
  },
  decorativeLine: {
    height: 2,
    width: "100%",
    borderRadius: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 10,
    marginLeft: 5,
  },
  sectionDivider: {
    height: 3,
    width: 40,
    marginBottom: 15,
    marginLeft: 5,
  },
  dividerGradient: {
    flex: 1,
    borderRadius: 1.5,
  },

  drawerItemContainer: {
    marginBottom: 8,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
    marginHorizontal: 5,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  activeDrawerItem: {
    backgroundColor: colors.white,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  pressedDrawerItem: {
    transform: [{ scale: 0.98 }],
  },
  activeGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundOverlay,
    marginRight: 15,
  },
  activeIconContainer: {
    backgroundColor: colors.white20,
  },
  drawerLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  activeDrawerLabel: {
    color: colors.white,
    fontWeight: "600",
  },
  activeIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    overflow: "hidden",
  },
  indicatorGradient: {
    flex: 1,
  },

  mainDivider: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  dividerLine: {
    height: 1,
    borderRadius: 0.5,
  },

  footer: {
    marginTop: 30,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: "hidden",
  },
  footerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  footerSubtext: {
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: 4,
    fontStyle: "italic",
  },
});
