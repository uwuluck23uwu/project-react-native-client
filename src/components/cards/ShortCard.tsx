import { useRef } from "react";
import { StyleSheet, Pressable, Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Paragraph, Title, Surface } from "react-native-paper";
import { colors } from "@/utils";
import Icon from "../Icon";

export const ShortCard = ({ data, onPress }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { name, image, breed, rating } = data;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Surface style={styles.enhancedShortCard} elevation={5}>
          <View style={styles.shortCardImageContainer}>
            <Card.Cover source={{ uri: image }} style={styles.shortCardImage} />
            <LinearGradient
              colors={["transparent", colors.black60]}
              style={styles.shortCardGradient}
            />
          </View>

          <View style={styles.shortCardContent}>
            <Title style={styles.shortCardTitle}>{name || "ไม่ระบุชื่อ"}</Title>
            <Paragraph style={styles.shortCardBreed}>
              {breed || "ไม่ระบุสายพันธุ์"}
            </Paragraph>

            <View style={styles.shortCardActions}>
              <Icon
                type="AntDesign"
                icon="star"
                size={14}
                color={colors.accentGold}
              />
              <Paragraph style={styles.shortCardRating}>
                {rating || 0}
              </Paragraph>
            </View>
          </View>
        </Surface>
      </Animated.View>
    </Pressable>
  );
};

export default ShortCard;

const styles = StyleSheet.create({
  enhancedShortCard: {
    borderRadius: 15,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    marginBottom: 15,
  },
  shortCardImageContainer: {
    position: "relative",
  },
  shortCardImage: {
    height: 140,
    resizeMode: "cover",
  },
  shortCardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  shortCardContent: {
    padding: 12,
  },
  shortCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  shortCardBreed: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  shortCardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  shortCardRating: {
    fontSize: 12,
    color: colors.textPrimary,
    marginLeft: 5,
    fontWeight: "500",
  },
});
