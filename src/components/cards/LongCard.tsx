import { useRef } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Title, Paragraph, Surface } from "react-native-paper";
import { colors } from "@/utils";
import Icon from "../Icon";

const LongCard = ({ data, onPress, width, height }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getDisplayData = () => {
    const safeString = (value: any): string => {
      if (value === null || value === undefined) return "";
      if (typeof value === "string") return value;
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };

    const safeName = safeString(data.name || data.title);
    const safeDescription = safeString(data.description || data.contents);

    if (data.type === "animal") {
      const species = safeString(data.species);
      const breed = safeString(data.breed);
      const scientificName = safeString(data.scientificName);

      return {
        name: safeName || "ไม่ระบุชื่อสัตว์",
        description: safeDescription || "ไม่มีข้อมูลเพิ่มเติม",
        subtitle: `สายพันธุ์: ${
          species || breed || scientificName || "ไม่ระบุสายพันธุ์"
        }`,
        rating: data.rating || 0,
      };
    } else if (data.type === "event") {
      const location = safeString(data.location);

      return {
        name: safeName || "ไม่ระบุชื่อกิจกรรม",
        description: safeDescription || "ไม่มีรายละเอียด",
        subtitle: `สถานที่: ${location || "ไม่ระบุสถานที่"}`,
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
        description: safeDescription || "ไม่มีเนื้อหา",
        subtitle: `วันที่เผยแพร่: ${dateString}`,
        rating: data.rating || 0,
      };
    }

    const fallbackSubtitle = safeString(
      data.breed || data.species || data.location || data.scientificName
    );

    return {
      name: safeName || "ไม่ระบุชื่อ",
      description: safeDescription || "ไม่มีข้อมูลเพิ่มเติม",
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
        <Surface style={[styles.enhancedLongCard, { width }]} elevation={5}>
          <View style={styles.cardImageContainer}>
            <Card.Cover
              source={{ uri: data.image }}
              style={[styles.cardImage, { height }]}
            />
            <LinearGradient
              colors={["transparent", colors.black70]}
              style={styles.cardGradientOverlay}
            />
            {displayData.rating > 0 && (
              <View style={styles.ratingBadge}>
                <Icon
                  type="AntDesign"
                  icon="star"
                  size={16}
                  color={colors.white}
                />
                <Paragraph style={styles.ratingText}>
                  {displayData.rating}/5
                </Paragraph>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Title style={styles.cardTitle} numberOfLines={1}>
              {displayData.name}
            </Title>
            <Paragraph style={styles.cardDescription} numberOfLines={2}>
              {displayData.description}
            </Paragraph>
            <Paragraph style={styles.cardBreed} numberOfLines={1}>
              {displayData.subtitle}
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
