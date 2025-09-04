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
  ColorValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Switch } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  Feather,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { logout } from "@/reduxs/slices/auth.slice";
import { RootState } from "@/reduxs/store";
import { useLanguage } from "@/contexts/LanguageContext";
import { myNavigation } from "@/utils";
import { Header, Icon } from "@/components";
import { useTranslation } from "@/translations";
import colors, { gradients } from "@/utils/colors";
import LogoutModal from "@/components/modals/LogoutModal";
import LanguageModal from "@/components/modals/LanguageModal";

const { width, height } = Dimensions.get("window");

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  iconLibrary:
    | "Ionicons"
    | "MaterialCommunityIcons"
    | "Feather"
    | "MaterialIcons";
  type: "navigation" | "switch" | "action";
  gradient?:
    | readonly [ColorValue, ColorValue]
    | readonly [ColorValue, ColorValue, ColorValue];
  switchValue?: boolean;
  onPress?: () => void;
  onSwitchChange?: (value: boolean) => void;
  badge?: string;
  isDestructive?: boolean;
}

const SettingScreen = () => {
  const dispatch = useDispatch();
  const { navigate } = myNavigation();
  const user = useSelector((state: RootState) => state.auth);

  // เพิ่ม Language Context และ Translation
  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const profileAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const itemAnimations = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.parallel([
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
      Animated.timing(profileAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
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

    const itemAnimSequence = itemAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      })
    );

    floatLoop.start();
    pulseLoop.start();

    setTimeout(() => {
      Animated.stagger(60, itemAnimSequence).start();
    }, 300);

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const handleLogin = () => {
    navigate("สมาชิก");
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    navigate("หน้าหลัก");
  };

  // เพิ่ม function สำหรับเปิด Language Modal
  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  const isLoggedIn = user && (user.accessToken || user.userId);

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  // อัปเดต settingSections ให้ใช้ translation และเพิ่ม language modal
  const settingSections = [
    {
      title: t("บัญชีผู้ใช้"),
      items: [
        {
          id: "profile",
          title: isLoggedIn ? t("ข้อมูลผู้ใช้") : t("กรุณาเข้าสู่ระบบ"),
          description: isLoggedIn
            ? t("แก้ไขรายละเอียดโปรไฟล์")
            : t("เข้าสู่ระบบเพื่อใช้งานเต็มรูปแบบ"),
          icon: isLoggedIn ? "person-outline" : "log-in-outline",
          iconLibrary: "Ionicons" as const,
          type: "navigation" as const,
          gradient: ["#667eea", "#764ba2"] as const,
          onPress: isLoggedIn ? () => navigate("บัญชี") : handleLogin,
        },
        ...(isLoggedIn
          ? [
              {
                id: "my-tickets",
                title: t("บัตรของฉัน"),
                description: t("ดูบัตรที่ซื้อแล้วและ_QR_Code"),
                icon: "ticket-outline",
                iconLibrary: "Ionicons" as const,
                type: "navigation" as const,
                gradient: ["#43e97b", "#38f9d7"] as const,
                onPress: () => navigate("บัตรของฉัน"),
              },
            ]
          : []),
      ] as SettingItem[],
    },
    {
      title: t("การตั้งค่าแอป"),
      items: [
        {
          id: "language",
          title: t("การตั้งค่าภาษา"),
          description: t("เปลี่ยนภาษาของแอปพลิเคชัน"),
          icon: "earth",
          iconLibrary: "MaterialCommunityIcons" as const,
          type: "navigation" as const,
          gradient: ["#f093fb", "#f5576c"] as const,
          badge: currentLanguage.toUpperCase(), // แสดง badge ภาษาปัจจุบัน
          onPress: handleLanguagePress, // เปลี่ยนเป็นเปิด modal
        },
        {
          id: "notifications",
          title: t("การแจ้งเตือน"),
          description: t("รับการแจ้งเตือนข่าวสารและโปรโมชัน"),
          icon: "notifications-outline",
          iconLibrary: "Ionicons" as const,
          type: "switch" as const,
          gradient: ["#4facfe", "#00f2fe"] as const,
          switchValue: notifications,
          onSwitchChange: setNotifications,
        },
        {
          id: "location",
          title: t("บริการตำแหน่ง"),
          description: t("อนุญาตให้แอปเข้าถึงตำแหน่งของคุณ"),
          icon: "location-outline",
          iconLibrary: "Ionicons" as const,
          type: "switch" as const,
          gradient: ["#43e97b", "#38f9d7"] as const,
          switchValue: locationServices,
          onSwitchChange: setLocationServices,
        },
        {
          id: "theme",
          title: t("โหมดมืด"),
          description: t("เปลี่ยนธีมเป็นโหมดมืด"),
          icon: "moon-outline",
          iconLibrary: "Ionicons" as const,
          type: "switch" as const,
          gradient: ["#2c3e50", "#4a6741"] as const,
          switchValue: darkMode,
          onSwitchChange: setDarkMode,
        },
      ] as SettingItem[],
    },
    {
      title: t("ข้อมูลและการช่วยเหลือ"),
      items: [
        {
          id: "ticket-scanner",
          title: t("สแกนบัตร_พนักงาน"),
          description: t("สแกน_QR_Code_ของลูกค้า"),
          icon: "qrcode-scan",
          iconLibrary: "MaterialCommunityIcons" as const,
          type: "navigation" as const,
          gradient: ["#667eea", "#764ba2"] as const,
          onPress: () => navigate("สแกนบัตร"),
        },
        {
          id: "help",
          title: t("ช่วยเหลือและสนับสนุน"),
          description: t("คำถามที่พบบ่อยและการติดต่อ"),
          icon: "help-circle-outline",
          iconLibrary: "Ionicons" as const,
          type: "navigation" as const,
          gradient: ["#fa709a", "#fee140"] as const,
          onPress: () => {},
        },
        {
          id: "privacy",
          title: t("นโยบายความเป็นส่วนตัว"),
          description: t("อ่านนโยบายและข้อกำหนด"),
          icon: "shield-checkmark-outline",
          iconLibrary: "Ionicons" as const,
          type: "navigation" as const,
          gradient: ["#a8edea", "#fed6e3"] as const,
          onPress: () => {},
        },
        {
          id: "about",
          title: t("เกี่ยวกับแอป"),
          description: t("เวอร์ชัน"),
          icon: "information-circle-outline",
          iconLibrary: "Ionicons" as const,
          type: "navigation" as const,
          gradient: ["#ffecd2", "#fcb69f"] as const,
          badge: "v1.0",
          onPress: () => {},
        },
      ] as SettingItem[],
    },
  ];

  const renderSettingItem = (item: SettingItem, index: number) => {
    const IconComponent =
      item.iconLibrary === "Ionicons"
        ? Ionicons
        : item.iconLibrary === "MaterialCommunityIcons"
        ? MaterialCommunityIcons
        : item.iconLibrary === "Feather"
        ? Feather
        : MaterialIcons;

    const animationIndex = index;

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.settingItemContainer,
          {
            opacity: itemAnimations[animationIndex],
            transform: [
              {
                translateX: itemAnimations[animationIndex].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
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
          onPress={item.onPress}
          style={({ pressed }) => [
            styles.settingItem,
            pressed && styles.settingItemPressed,
          ]}
        >
          <LinearGradient
            colors={[colors.white, colors.backgroundCard]}
            style={styles.itemGradient}
          >
            <View style={styles.itemLeft}>
              <LinearGradient
                colors={item.gradient || [colors.primary, colors.primaryLight]}
                style={styles.iconContainer}
              >
                <Icon
                  type={item.iconLibrary}
                  icon={item.icon}
                  size={22}
                  color={colors.white}
                />
              </LinearGradient>

              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
              </View>
            </View>

            <View style={styles.itemRight}>
              {item.type === "switch" ? (
                <Switch
                  value={item.switchValue}
                  onValueChange={item.onSwitchChange}
                  thumbColor={
                    item.switchValue ? colors.accentGold : colors.silver
                  }
                  trackColor={{
                    false: colors.platinum,
                    true: colors.accentGoldLight,
                  }}
                />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textTertiary}
                />
              )}
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Header options={{ title: t("ตั้งค่า_title") }} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={gradients.tuscanHills.colors}
            start={gradients.tuscanHills.start}
            end={gradients.tuscanHills.end}
            style={styles.heroGradient}
          >
            {/* Background decorative elements */}
            <Animated.View
              style={[
                styles.decorativeCircle,
                styles.circle1,
                {
                  transform: [{ translateY: floatTranslateY }],
                  opacity: fadeAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.decorativeCircle,
                styles.circle2,
                {
                  transform: [
                    {
                      translateY: floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 5],
                      }),
                    },
                  ],
                  opacity: fadeAnim,
                },
              ]}
            />

            {/* Profile Section */}
            {isLoggedIn ? (
              <Animated.View
                style={[
                  styles.profileSection,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: profileAnim },
                    ],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.avatarContainer,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <View style={styles.avatarSurface}>
                    <Avatar.Image
                      size={100}
                      source={
                        user.imageUrl
                          ? { uri: user.imageUrl }
                          : require("@/../assets/icon.png")
                      }
                      style={styles.avatar}
                    />
                  </View>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.welcomeTextContainer,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
                >
                  <Text style={styles.welcomeText}>{t("ยินดีต้อนรับสู่")}</Text>
                  <Text style={styles.nameText}>
                    {user.username || "ผู้ใช้งาน"}
                  </Text>
                </Animated.View>
              </Animated.View>
            ) : (
              <Animated.View
                style={[
                  styles.profileSection,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: profileAnim },
                    ],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    styles.avatarContainer,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <View style={styles.avatarSurface}>
                    <Avatar.Image
                      size={100}
                      source={require("@/../assets/icon.png")}
                      style={styles.avatar}
                    />
                  </View>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.welcomeTextContainer,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
                >
                  <Text style={styles.welcomeText}>{t("ยินดีต้อนรับสู่")}</Text>
                  <Text style={styles.nameText}>{t("การตั้งค่า")}</Text>
                </Animated.View>
              </Animated.View>
            )}
          </LinearGradient>
        </View>

        {/* Form Container */}
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => {
            let itemIndex = sectionIndex === 0 ? 1 : sectionIndex === 1 ? 2 : 6;

            return (
              <View key={section.title} style={styles.section}>
                <Animated.View
                  style={[
                    styles.sectionHeader,
                    {
                      opacity: itemAnimations[itemIndex - 1],
                      transform: [
                        {
                          translateX: itemAnimations[itemIndex - 1].interpolate(
                            {
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            }
                          ),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <LinearGradient
                    colors={[colors.accentGold, colors.accentGoldLight]}
                    style={styles.sectionDivider}
                  />
                </Animated.View>

                {section.items.map((item) =>
                  renderSettingItem(item, itemIndex++)
                )}
              </View>
            );
          })}

          {/* Logout Button */}
          {isLoggedIn && (
            <Animated.View
              style={[
                styles.logoutContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Pressable
                onPress={() => setShowLogoutModal(true)}
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && styles.logoutButtonPressed,
                ]}
              >
                <LinearGradient
                  colors={[colors.error, colors.errorDark]}
                  style={styles.logoutGradient}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color={colors.white}
                  />
                  <Text style={styles.logoutText}>{t("ออกจากระบบ")}</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Language Modal - เพิ่ม Modal ใหม่ */}
      <LanguageModal
        visible={showLanguageModal}
        onDismiss={() => setShowLanguageModal(false)}
      />

      {/* Logout Modal */}
      {isLoggedIn && (
        <LogoutModal
          visible={showLogoutModal}
          onDismiss={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          title={t("ออกจากระบบ")}
          description={t("คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ")}
          iconName="log-out-outline"
          iconGradient={[colors.error, colors.errorLight]}
          confirmText={t("ออกจากระบบ")}
          cancelText={t("ยกเลิก")}
        />
      )}
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  heroSection: {
    height: height * 0.4,
    position: "relative",
  },
  heroGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  decorativeCircle: {
    position: "absolute",
    backgroundColor: colors.white20,
    borderRadius: 100,
  },
  circle1: {
    width: 150,
    height: 150,
    top: 50,
    right: -50,
  },
  circle2: {
    width: 100,
    height: 100,
    bottom: 20,
    left: -30,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatarSurface: {
    borderRadius: 60,
    backgroundColor: colors.white,
    padding: 10,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    backgroundColor: colors.backgroundAlt,
  },
  welcomeTextContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 5,
    textAlign: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    textShadowColor: colors.black30,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  formContainer: {
    marginTop: -70,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  section: {
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionDivider: {
    height: 3,
    width: 40,
    borderRadius: 1.5,
  },

  settingItemContainer: {
    marginBottom: 8,
  },
  settingItem: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  itemGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundCard + "50",
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.accentGold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  itemDescription: {
    fontSize: 13,
    color: colors.textTertiary,
    lineHeight: 18,
  },
  itemRight: {
    justifyContent: "center",
  },

  logoutContainer: {
    marginTop: 30,
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoutButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
    marginLeft: 10,
  },

  bottomSpacer: {
    height: 50,
  },
});
