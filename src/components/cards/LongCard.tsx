import { useRef } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Title, Paragraph, Surface } from "react-native-paper";
import { colors } from "@/utils";
import Icon from "../Icon";

const LongCard = ({ data, onPress, width, height }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const { name, image, description, breed, rating } = data;

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
        <Surface style={[styles.enhancedLongCard, { width }]} elevation={5}>
          <View style={styles.cardImageContainer}>
            <Card.Cover
              source={{ uri: image }}
              style={[styles.cardImage, { height }]}
            />
            <LinearGradient
              colors={["transparent", colors.black70]}
              style={styles.cardGradientOverlay}
            />
            {rating && (
              <View style={styles.ratingBadge}>
                <Icon
                  type="AntDesign"
                  icon="star"
                  size={16}
                  color={colors.white}
                />
                <Paragraph style={styles.ratingText}>{rating}/5</Paragraph>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Title style={styles.cardTitle}>{name || "ไม่ระบุชื่อ"}</Title>
            <Paragraph style={styles.cardDescription}>
              {description || "ไม่มีข้อมูลเพิ่มเติม"}
            </Paragraph>
            <Paragraph style={styles.cardBreed}>
              สายพันธุ์: {breed || "ไม่ระบุสายพันธุ์"}
            </Paragraph>
          </View>
        </Surface>
      </Animated.View>
    </Pressable>
  );
};

export default LongCard;

const styles = StyleSheet.create({
  enhancedLongCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  cardImageContainer: {
    position: "relative",
  },
  cardImage: {
    resizeMode: "cover",
  },
  cardGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  ratingBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ratingText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
    lineHeight: 20,
  },
  cardBreed: {
    fontSize: 12,
    color: colors.accentGreen,
    fontWeight: "500",
  },
});
