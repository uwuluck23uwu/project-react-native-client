import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Icon } from "@/components";
import { colors } from "@/utils";
import type { Marker } from "@/components/modal/MapModal";

interface PinProps {
  marker: Marker;
  onPress: () => void;
  index: number;
  mapWidth: number;
  mapHeight: number;
}

const Pin: React.FC<PinProps> = ({
  marker,
  onPress,
  index,
  mapWidth,
  mapHeight,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 120;

    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // คำนวณตำแหน่งจากพิกัดแบบเปอร์เซ็นต์
  const left = (marker.x / 100) * mapWidth - 35;
  const top = (marker.y / 100) * mapHeight - 35;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <View style={[styles.absolute, { left, top }]}>
      <Animated.View
        style={[
          styles.glowEffect,
          {
            backgroundColor: marker.color,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pinContainer,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
              {
                translateY: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          style={[styles.modernPin, { backgroundColor: marker.color }]}
          activeOpacity={0.8}
        >
          <Icon
            icon={marker.icon}
            type={marker.iconType}
            size={28}
            color={colors.white}
          />
          <View style={[styles.pinShadow, { backgroundColor: marker.color }]} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Pin;

const styles = StyleSheet.create({
  absolute: { position: "absolute", alignItems: "center" },

  glowEffect: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    top: -10,
    left: -10,
  },

  pinContainer: { alignItems: "center" },

  modernPin: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.white,
    position: "relative",
    zIndex: 2,
  },

  pinShadow: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.3,
    top: 6,
    left: 0,
    zIndex: 1,
  },
});
