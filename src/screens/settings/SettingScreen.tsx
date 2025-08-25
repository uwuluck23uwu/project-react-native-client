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
import { BlurView } from "expo-blur";
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
import { myNavigation } from "@/utils";
import { Header, Icon } from "@/components";
import colors, { gradients } from "@/utils/colors";
import LogoutModal from "@/components/modals/LogoutModal";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const profileAnim = useRef(new Animated.Value(0)).current;

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

    const itemAnimSequence = itemAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 80,
        useNativeDriver: true,
      })
    );

    setTimeout(() => {
      Animated.stagger(60, itemAnimSequence).start();
    }, 300);
  }, []);

  const handleLogin = () => {
    navigate("สมาชิก");
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    navigate("หน้าหลัก");
  };

  const settingSections = [
    {
      title: "บัญชีผู้ใช้",
      items: [
        {
          id: "profile",
          title: user ? "ข้อมูลผู้ใช้" : "กรุณาเข้าสู่ระบบ",
          description: user
            ? "แก้ไขรายละเอียดโปรไฟล์"
            : "เข้าสู่ระบบเพื่อใช้งานเต็มรูปแบบ",
          icon: user ? "person-outline" : "log-in-outline",
          iconLibrary: "Ionicons" as const,
          type: "navigation" as const,
          gradient: ["#667eea", "#764ba2"],
          onPress: user ? () => navigate("บัญชี") : handleLogin,
        },
      ] as SettingItem[],
    },
    {
      title: "การตั้งค่าแอป",
      items: [
        {
          id: "language",
          title: "การตั้งค่าภาษา",
          description: "เปลี่ยนภาษาของแอปพลิเคชัน",
          icon: "earth",
          iconLibrary: "MaterialCommunityIcons" as const,
          type: "navigation" as const,
          gradient: ["#f093fb", "#f5576c"],
          badge: "TH",
          onPress: () => {},
        },
        {
          id: "notifications",
          title: "การแจ้งเตือน",
          description: "รับการแจ้งเตือนข่าวสารและโปรโมชัน",
          icon: "notifications-outline",
          iconLibrary: "Ionicons" as const,
          type: "switch" as const,
          gradient: ["#4facfe", "#00f2fe"],
          switchValue: notifications,
          onSwitchChange: setNotifications,
        },
        {
          id: "location",
          title: "บริการตำแหน่ง",
          description: "อนุญาตให้แอปเข้าถึงตำแหน่งของคุณ",
          icon: "location-outline",
          iconLibrary: "Ionicons" as const,
          type: "switch" as const,
          gradient: ["#43e97b", "#38f9d7"],
          switchValue: locationServices,
          onSwitchChange: setLocationServices,
        },
        {
          id: "theme",
          title: "โหมดมืด",
          description: "เปลี่ยนธีมเป็นโหมดมืด",
          icon: "moon-outline",
          iconLibrary: "Ionicons" as const,
          type: "switch" as const,
          gradient: ["#2c3e50", "#4a6741"],
          switchValue: darkMode,
          onSwitchChange: setDarkMode,
        },
      ] as SettingItem[],
    },
    {
      title: "ข้อมูลและการช่วยเหลือ",
      items: [
        {
          id: "help",
          title: "ช่วยเหลือและสนับสนุน",
          description: "คำถามที่พบบ่อยและการติดต่อ",
          icon: "help-circle-outline",
          iconLibrary: "Ionicons" as const,
          type: "navigation" as const,
          gradient: ["#fa709a", "#fee140"],
          onPress: () => {},
        },
        {
          id: "privacy",
          title: "นโยบายความเป็นส่วนตัว",
          description: "อ่านนโยบายและข้อกำหนด",
          icon: "shield-checkmark-outline",
          iconLibrary: "Ionicons" as const,
          type: "navigation" as const,
          gradient: ["#a8edea", "#fed6e3"],
          onPress: () => {},
        },
        {
          id: "about",
          title: "เกี่ยวกับแอป",
          description: "เวอร์ชัน 1.0.0",
          icon: "information-circle-outline",
          iconLibrary: "Ionicons" as const,
          type: "navigation" as const,
          gradient: ["#ffecd2", "#fcb69f"],
          badge: "v1.0",
          onPress: () => {},
        },
      ] as SettingItem[],
    },
  ];

  const renderProfileHeader = () => (
    <Animated.View
      style={[
        styles.profileHeader,
        {
          opacity: profileAnim,
          transform: [
            {
              translateY: profileAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              }),
            },
            {
              scale: profileAnim,
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={gradients.tuscanHills.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileGradient}
      >
        <BlurView intensity={20} tint="dark" style={styles.profileBlur} />

        <View style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#FFD700", "#FFA500"]}
              style={styles.avatarGradient}
            >
              <Avatar.Image
                source={require("@/../assets/icon.png")}
                size={80}
                style={styles.avatar}
              />
            </LinearGradient>

            {user && (
              <View style={styles.onlineIndicator}>
                <LinearGradient
                  colors={["#4CAF50", "#8BC34A"]}
                  style={styles.onlineGradient}
                />
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user ? "ยินดีต้อนรับ" : "ยินดีต้อนรับสู่ Primo Piazza"}
            </Text>
            <Text style={styles.profileSubtitle}>
              {user
                ? "สมาชิก Premium"
                : "เข้าสู่ระบบเพื่อประสบการณ์ที่ดียิ่งขึ้น"}
            </Text>
          </View>

          {user && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>เช็คอิน</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>รีวิว</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>85</Text>
                <Text style={styles.statLabel}>คะแนน</Text>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );

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

  const renderLogoutButton = () => {
    const isLoggedIn = !!user;

    return (
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
          onPress={isLoggedIn ? () => setShowLogoutModal(true) : handleLogin}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
            !isLoggedIn && styles.loginButton,
          ]}
        >
          <LinearGradient
            colors={
              isLoggedIn
                ? [colors.error, colors.errorDark]
                : [colors.primary, colors.primaryDark]
            }
            style={styles.logoutGradient}
          >
            <Ionicons
              name={isLoggedIn ? "log-out-outline" : "log-in-outline"}
              size={24}
              color={colors.white}
            />
            <Text style={styles.logoutText}>
              {isLoggedIn ? "ออกจากระบบ" : "เข้าสู่ระบบ"}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Header options={{ title: "ตั้งค่า" }} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderProfileHeader()}

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

          {renderLogoutButton()}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </Animated.View>

      <LogoutModal
        visible={showLogoutModal}
        onDismiss={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="ออกจากระบบ"
        description="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?"
        iconName="log-out-outline"
        iconGradient={[colors.error, colors.errorLight]}
        confirmText="ออกจากระบบ"
        cancelText="ยกเลิก"
      />
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  profileHeader: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  profileGradient: {
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  profileBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  profileContent: {
    alignItems: "center",
    zIndex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatarGradient: {
    padding: 4,
    borderRadius: 50,
  },
  avatar: {
    backgroundColor: colors.white,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.white,
  },
  onlineGradient: {
    flex: 1,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "center",
    marginBottom: 5,
    textShadowColor: colors.black30,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: colors.cream,
    textAlign: "center",
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.cream,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.white30,
  },

  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginHorizontal: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionDivider: {
    height: 3,
    width: 40,
    borderRadius: 1.5,
  },

  settingItemContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingItem: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItemPressed: {
    transform: [{ scale: 0.98 }],
  },
  itemGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    marginHorizontal: 20,
    marginTop: 20,
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
  loginButton: {
    shadowColor: colors.primary,
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

  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 25,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 25,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.platinum,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalConfirmGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },

  bottomSpacer: {
    height: 50,
  },
});
