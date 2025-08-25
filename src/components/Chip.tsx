import React, { useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { Paragraph } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/utils/colors";
import { Icon } from "@/components";

type IconType =
  | "FontAwesome"
  | "FontAwesome5"
  | "Feather"
  | "Fontisto"
  | "AntDesign"
  | "Ionicons"
  | "MaterialCommunityIcons";

type Props = {
  label: string;
  icon: string;
  type: IconType;
  selected?: boolean;
  gradient?: readonly [string, string];
  style?: ViewStyle;
  onPress?: () => void;
  appearDelay?: number;
};

const Chip: React.FC<Props> = ({
  label,
  icon,
  type,
  selected = false,
  gradient = ["#667eea", "#764ba2"],
  style,
  onPress,
  appearDelay = 0,
}) => {
  // ----- Animations -----
  const enter = useRef(new Animated.Value(0)).current; // 0 -> 1 (opacity/translate/scale)
  const press = useRef(new Animated.Value(1)).current; // scale when press in/out
  const selectBounce = useRef(new Animated.Value(1)).current; // bounce when selected changes

  // เล่นตอน mount: จาง->ชัด เลื่อนขึ้นนิด ๆ และซูมนิด ๆ
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 420,
      delay: appearDelay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [appearDelay, enter]);

  // เด้งเบา ๆ ตอน selected เปลี่ยน
  useEffect(() => {
    Animated.sequence([
      Animated.timing(selectBounce, {
        toValue: 1.06,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(selectBounce, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selected]);

  const onPressIn = () => {
    Animated.spring(press, {
      toValue: 0.96,
      friction: 6,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(press, {
      toValue: 1,
      friction: 6,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const chipColors = selected
    ? gradient
    : ([colors.white, colors.backgroundAlt] as const);

  const animatedStyle = {
    opacity: enter,
    transform: [
      {
        translateY: enter.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: Animated.multiply(
          press,
          enter.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] })
        ),
      },
      { scale: selectBounce },
    ],
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
      style={[styles.wrapper, style]}
    >
      <Animated.View style={[styles.animatedWrap, animatedStyle]}>
        <LinearGradient
          colors={chipColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.chip, selected && styles.selected]}
        >
          <Icon
            icon={icon}
            type={type}
            size={16}
            color={selected ? "#fff" : colors.textPrimary}
          />
          <Paragraph
            style={[styles.label, selected && styles.labelSelected]}
            numberOfLines={1}
          >
            {label}
          </Paragraph>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

export default Chip;

const styles = StyleSheet.create({
  wrapper: { borderRadius: 20 },
  animatedWrap: { borderRadius: 20 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selected: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});
