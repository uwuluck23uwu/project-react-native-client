import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Appbar, Text } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { logout } from "@/reduxs/slices/auth.slice";
import { BASE_URL } from "@/utils";
import { RootState } from "@/reduxs/store";
import colors, { gradients } from "@/utils/colors";

const { width, height } = Dimensions.get("window");

interface Prop {
  options: {
    title?: string;
  };
}

const Header = ({ options }: Prop) => {
  const { openDrawer, navigate } = useNavigation<DrawerNavigationProp<any>>();
  const dispatch = useDispatch();

  const { accessToken, username, imageUrl } = useSelector(
    (state: RootState) => state.auth
  );
  const isAuthenticated = !!accessToken;

  const [showUserMenu, setShowUserMenu] = useState(false);

  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const authButtonsScale = useRef(new Animated.Value(0)).current;
  const authButtonsOpacity = useRef(new Animated.Value(0)).current;
  const userMenuScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerLoop.start();

    return () => shimmerLoop.stop();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      Animated.parallel([
        Animated.timing(authButtonsScale, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(authButtonsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(authButtonsScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(authButtonsOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isAuthenticated]);

  const handleMenuPress = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    openDrawer();
  };

  const handleUserMenuToggle = () => {
    const newValue = !showUserMenu;
    setShowUserMenu(newValue);

    Animated.spring(userMenuScale, {
      toValue: newValue ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    dispatch(logout());
  };

  const handleProfile = () => {
    setShowUserMenu(false);
    navigate("Profile" as never);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const renderAuthButtons = () => {
    if (isAuthenticated) return null;

    return (
      <Animated.View
        style={[
          styles.authButtonsContainer,
          {
            transform: [{ scale: authButtonsScale }],
            opacity: authButtonsOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => navigate("สมาชิก")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.accentGold, colors.accentGoldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.authButtonGradient}
          >
            <Text style={styles.authButtonText}>เข้าสู่ระบบ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderUserMenu = () => {
    if (!isAuthenticated) return null;

    return (
      <View style={styles.userMenuContainer}>
        <TouchableOpacity
          style={styles.userButton}
          onPress={handleUserMenuToggle}
          activeOpacity={0.8}
        >
          <View style={styles.userAvatar}>
            {imageUrl ? (
              <Animated.Image
                source={{ uri: `${BASE_URL}${imageUrl}` }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {username?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>สวัสดี</Text>
            <Text style={styles.usernameText} numberOfLines={1}>
              {username || "User"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary}
        translucent={false}
      />

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <LinearGradient
          colors={gradients.tuscanHills.colors}
          start={gradients.tuscanHills.start}
          end={gradients.tuscanHills.end}
          style={styles.gradient}
        >
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: shimmerTranslateX }],
              },
            ]}
          />

          <View style={styles.decorativeElements}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>

          <View style={styles.headerContent}>
            <Animated.View
              style={[
                styles.menuButton,
                {
                  transform: [{ rotate: rotateInterpolate }],
                },
              ]}
            >
              <Appbar.Action
                icon="menu"
                iconColor={colors.white}
                onPress={handleMenuPress}
                style={styles.menuIcon}
              />
            </Animated.View>

            <Animated.View style={styles.titleContainer}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>
                  {options?.title || "Primo Piazza"}
                </Text>
              </View>
            </Animated.View>

            <View style={styles.rightSection}>
              {renderAuthButtons()}
              {renderUserMenu()}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
  },
  gradient: {
    height: 130,
    position: "relative",
    overflow: "hidden",
    paddingTop: Platform.OS === "ios" ? 8 : 8,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.shimmer,
    transform: [{ skewX: "-20deg" }],
    width: 100,
  },
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
    width: 80,
    height: 80,
    top: -20,
    right: -20,
  },
  circle2: {
    width: 60,
    height: 60,
    top: 30,
    right: 100,
  },
  circle3: {
    width: 40,
    height: 40,
    top: -10,
    left: 200,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    position: "relative",
    zIndex: 2,
  },
  menuButton: {
    backgroundColor: colors.white20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuIcon: {
    margin: 0,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  titleWrapper: {
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    textShadowColor: colors.black40,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },

  rightSection: {
    minWidth: 80,
    alignItems: "flex-end",
  },

  authButtonsContainer: {
    alignItems: "flex-end",
  },
  authButton: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  authButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  authButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
  },

  userMenuContainer: {
    position: "relative",
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white20,
    borderRadius: 25,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentGold,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
  },
  userInfo: {
    alignItems: "flex-start",
  },
  welcomeText: {
    fontSize: 10,
    color: colors.white80,
  },
  usernameText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.white,
    maxWidth: 60,
  },

  userDropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    zIndex: 1000,
    minWidth: 160,
  },
  dropdownBlur: {
    borderRadius: 12,
    overflow: "hidden",
  },
  dropdownSurface: {
    borderRadius: 12,
    backgroundColor: colors.white95,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 12,
    fontWeight: "500",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: colors.platinum,
    marginHorizontal: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black50,
  },
  modalContent: {
    width: width * 0.85,
    maxWidth: 400,
  },
  modalSurface: {
    borderRadius: 20,
    overflow: "hidden",
  },
  modalGradient: {
    padding: 30,
    alignItems: "center",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
    marginTop: 5,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  modalButtons: {
    width: "100%",
    gap: 12,
  },
  modalButton: {
    width: "100%",
    borderRadius: 25,
    overflow: "hidden",
    elevation: 2,
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
  },
  modalCloseText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
