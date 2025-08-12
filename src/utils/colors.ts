const colors = {
  // 🏛️ Primary Italian Colors
  primary: "#2C5530", // Deep Forest Green (Italian countryside)
  primaryLight: "#4A7C59", // Lighter forest green
  primaryDark: "#1B3A1F", // Darker forest green

  secondary: "#8B4513", // Tuscan Brown (terracotta roofs)
  secondaryLight: "#CD853F", // Sandy brown
  secondaryDark: "#654321", // Dark brown

  // ✨ Accent Colors
  accentGold: "#FFD700", // Italian Gold (luxury feel)
  accentGoldLight: "#FFF176", // Light gold
  accentGoldDark: "#F57F17", // Deep gold

  accentGreen: "#6B8E23", // Olive Green (Mediterranean)
  accentGreenLight: "#9ACD32", // Yellow green
  accentGreenDark: "#556B2F", // Dark olive

  accentTerracotta: "#E2725B", // Terracotta (Italian pottery)
  accentTerracottaLight: "#FFAB91", // Light terracotta
  accentTerracottaDark: "#BF360C", // Deep terracotta

  // 🌅 Italian Sky & Nature
  tuscanSky: "#87CEEB", // Tuscan sky blue
  tuscanSkyLight: "#B3E5FC", // Light sky
  tuscanSkyDark: "#0277BD", // Deep sky

  vineGreen: "#228B22", // Vineyard green
  sunflowerYellow: "#FFA500", // Sunflower fields
  lavenderPurple: "#9370DB", // Provence lavender

  // 🤍 Neutrals & Whites
  white: "#FFFFFF",
  cream: "#FFF8DC", // Italian cream
  ivory: "#FFFFF0", // Ivory white
  linen: "#FAF0E6", // Linen texture

  platinum: "#E5E4E2", // Soft platinum
  silver: "#C0C0C0", // Italian silver
  pearl: "#F8F6F0", // Pearl white

  // 📝 Text Colors
  textPrimary: "#2C2C2C", // Dark charcoal
  textSecondary: "#5D4E75", // Muted purple-gray
  textTertiary: "#8B7355", // Warm brown-gray
  textLight: "#FFFFFF", // White text
  textMuted: "#9E9E9E", // Muted gray

  // 🏠 Background Colors
  backgroundMain: "#F7F5F3", // Warm off-white
  backgroundAlt: "#FEFCF7", // Creamy white
  backgroundCard: "#FFFFFF", // Pure white for cards
  backgroundOverlay: "#F9F7F4", // Subtle overlay

  // 🌟 Modern Gradients
  gradientSunset: ["#FF6B6B", "#FFE66D", "#FF6B6B"], // Italian sunset
  gradientTuscan: ["#8B4513", "#CD853F", "#DEB887"], // Tuscan hills
  gradientSky: ["#87CEEB", "#B3E5FC", "#E1F5FE"], // Italian sky
  gradientVineyard: ["#228B22", "#6B8E23", "#9ACD32"], // Vineyard
  gradientGold: ["#FFD700", "#FFF176", "#FFECB3"], // Golden hour

  // 💫 Interactive States
  hover: "#F5F5F5", // Hover state
  pressed: "#EEEEEE", // Pressed state
  focus: "#E3F2FD", // Focus state
  disabled: "#BDBDBD", // Disabled state

  // 🚨 Status Colors
  success: "#4CAF50", // Italian green success
  successLight: "#C8E6C9",
  successDark: "#2E7D32",

  warning: "#FF9800", // Tuscan orange warning
  warningLight: "#FFE0B2",
  warningDark: "#F57C00",

  error: "#F44336", // Italian red error
  errorLight: "#FFCDD2",
  errorDark: "#D32F2F",

  info: "#2196F3", // Mediterranean blue
  infoLight: "#BBDEFB",
  infoDark: "#1976D2",

  // 🌫️ Opacity Variants (for modern glassmorphism)
  white95: "rgba(255,255,255,0.95)",
  white90: "rgba(255,255,255,0.9)",
  white80: "rgba(255,255,255,0.8)",
  white70: "rgba(255,255,255,0.7)",
  white60: "rgba(255,255,255,0.6)",
  white50: "rgba(255,255,255,0.5)",
  white40: "rgba(255,255,255,0.4)",
  white30: "rgba(255,255,255,0.3)",
  white20: "rgba(255,255,255,0.2)",
  white10: "rgba(255,255,255,0.1)",
  white05: "rgba(255,255,255,0.05)",

  black95: "rgba(0,0,0,0.95)",
  black90: "rgba(0,0,0,0.9)",
  black80: "rgba(0,0,0,0.8)",
  black70: "rgba(0,0,0,0.7)",
  black60: "rgba(0,0,0,0.6)",
  black50: "rgba(0,0,0,0.5)",
  black40: "rgba(0,0,0,0.4)",
  black30: "rgba(0,0,0,0.3)",
  black20: "rgba(0,0,0,0.2)",
  black10: "rgba(0,0,0,0.1)",
  black05: "rgba(0,0,0,0.05)",

  // 🎨 Primary Color Variants with Opacity
  primaryAlpha90: "rgba(44,85,48,0.9)",
  primaryAlpha80: "rgba(44,85,48,0.8)",
  primaryAlpha70: "rgba(44,85,48,0.7)",
  primaryAlpha50: "rgba(44,85,48,0.5)",
  primaryAlpha30: "rgba(44,85,48,0.3)",
  primaryAlpha20: "rgba(44,85,48,0.2)",
  primaryAlpha10: "rgba(44,85,48,0.1)",

  // 🌅 Shadow & Elevation
  shadowColor: "#000000",
  shadowLight: "rgba(0,0,0,0.1)",
  shadowMedium: "rgba(0,0,0,0.2)",
  shadowDark: "rgba(0,0,0,0.3)",
  shadowHeavy: "rgba(0,0,0,0.4)",

  // 🏰 Themed Colors for Different Sections
  ticketSection: "#F7F5F3", // Warm background for tickets
  restaurantSection: "#FFF8DC", // Creamy for restaurant
  attractionSection: "#F0F8FF", // Light blue for attractions
  shopSection: "#F5FFFA", // Mint cream for shopping
  hotelSection: "#FDF5E6", // Old lace for accommodation

  // 🎪 Special Effects
  shimmer: "rgba(255,255,255,0.6)", // Shimmer effect
  glow: "rgba(255,215,0,0.3)", // Golden glow
  frost: "rgba(255,255,255,0.15)", // Frosted glass

  // 📱 Bottom Navigation
  bottomNavActive: "#2C5530", // Active tab
  bottomNavInactive: "#8B7355", // Inactive tab
  bottomNavBackground: "#FFFFFF", // Nav background

  // 🔔 Notification Colors
  notificationBg: "#FFF3E0", // Light orange background
  notificationBorder: "#FFB74D", // Orange border
  notificationIcon: "#FF9800", // Orange icon
};

// 🎨 Color combinations for easy theming
export const colorCombinations = {
  // Primary combinations
  primaryOnLight: {
    background: colors.backgroundMain,
    primary: colors.primary,
    secondary: colors.textSecondary,
    accent: colors.accentGold,
  },

  // Card combinations
  cardElegant: {
    background: colors.white,
    border: colors.platinum,
    text: colors.textPrimary,
    accent: colors.accentTerracotta,
  },

  // Header combinations
  headerItalian: {
    background: colors.gradientTuscan,
    text: colors.white,
    accent: colors.accentGold,
    icon: colors.cream,
  },

  // Button combinations
  buttonPrimary: {
    background: colors.primary,
    text: colors.white,
    hover: colors.primaryLight,
    pressed: colors.primaryDark,
  },

  buttonSecondary: {
    background: colors.secondary,
    text: colors.white,
    hover: colors.secondaryLight,
    pressed: colors.secondaryDark,
  },

  buttonGold: {
    background: colors.accentGold,
    text: colors.textPrimary,
    hover: colors.accentGoldLight,
    pressed: colors.accentGoldDark,
  },
};

export const gradients = {
  italianSunset: {
    colors: ["#FF6B6B", "#FFE66D"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  tuscanHills: {
    colors: ["#8B4513", "#CD853F", "#DEB887"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },

  mediterraneanSky: {
    colors: ["#87CEEB", "#B3E5FC"] as const,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },

  goldenHour: {
    colors: ["#FFD700", "#FFF176", "#FFECB3"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  vineyard: {
    colors: ["#228B22", "#6B8E23", "#9ACD32"] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
};

export default colors;
