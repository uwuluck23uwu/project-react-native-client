import { useRef } from "react";
import { StyleSheet, Pressable, Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Paragraph, Title, Surface } from "react-native-paper";
import { colors } from "@/utils";
import Icon from "../Icon";

export const ShortCard = ({ data, onPress }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getDisplayData = () => {
    const safeString = (value: any): string => {
      if (value === null || value === undefined) return "";
      if (typeof value === "string") return value;
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };

    const safeName = safeString(data.name || data.title);

    if (data.type === "animal") {
      const species = safeString(data.species);
      const breed = safeString(data.breed);
      const scientificName = safeString(data.scientificName);

      return {
        name: safeName || "ไม่ระบุชื่อสัตว์",
        subtitle: species || breed || scientificName || "ไม่ระบุสายพันธุ์",
        rating: data.rating || 0,
      };
    } else if (data.type === "event") {
      const location = safeString(data.location);

      return {
        name: safeName || "ไม่ระบุชื่อกิจกรรม",
        subtitle: location || "ไม่ระบุสถานที่",
        rating: data.rating || 0,
      };
    } else if (data.type === "news") {
      let dateString = "ไม่ระบุวันที่";
      if (data.publishedDate) {
        try {
          dateString = new Date(data.publishedDate).toLocaleDateString("th-TH");
        } catch (error) {
          dateString = safeString(data.publishedDate) || "ไม่ระบุวันที่";
        }
      }

      return {
        name: safeName || "ไม่ระบุหัวข้อข่าว",
        subtitle: dateString,
        rating: data.rating || 0,
      };
    }

    const fallbackSubtitle = safeString(
      data.breed || data.species || data.location || data.scientificName
    );

    return {
      name: safeName || "ไม่ระบุชื่อ",
      subtitle: fallbackSubtitle || "ไม่ระบุข้อมูล",
      rating: data.rating || 0,
    };
  };

  const displayData = getDisplayData();

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
            <Card.Cover
              source={{ uri: data.image }}
              style={styles.shortCardImage}
            />
            <LinearGradient
              colors={["transparent", colors.black60]}
              style={styles.shortCardGradient}
            />
          </View>

          <View style={styles.shortCardContent}>
            <Title style={styles.shortCardTitle} numberOfLines={1}>
              {displayData.name}
            </Title>
            <Paragraph style={styles.shortCardBreed} numberOfLines={1}>
              {displayData.subtitle}
            </Paragraph>

            <View style={styles.shortCardActions}>
              <Icon
                type="AntDesign"
                icon="star"
                size={14}
                color={colors.accentGold}
              />
              <Paragraph style={styles.shortCardRating}>
                {displayData.rating}
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
