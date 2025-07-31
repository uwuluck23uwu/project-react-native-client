import { View, StyleSheet, Pressable } from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";
import { colors } from "@/utils";

const LongCard = ({ data, onPress, width, height }: any) => {
  const { name, image, description, breed, rating } = data;

  return (
    <Pressable onPress={onPress}>
      <Card style={[styles.cardContainer, { width }]}>
        <View>
          <Card.Cover
            source={{ uri: image }}
            style={[styles.cardImage, { height }]}
          />
          {rating !== null && rating !== undefined && (
            <View style={styles.ratingBadge}>
              <IconButton icon="star" iconColor={colors.white} size={20} />
              <Paragraph style={styles.ratingText}>{`${rating}/5`}</Paragraph>
            </View>
          )}
        </View>

        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>{name || "ไม่ระบุชื่อ"}</Title>
          <Paragraph style={styles.paragraph}>
            ถิ่นอาศัย: {description || "ไม่มีข้อมูลเพิ่มเติม"}
          </Paragraph>
        </Card.Content>

        <Card.Actions style={styles.cardActions}>
          <Paragraph style={styles.paragraph}>
            สายพันธุ์: {breed || "ไม่ระบุสายพันธุ์"}
          </Paragraph>
        </Card.Actions>
      </Card>
    </Pressable>
  );
};

export default LongCard;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.platinum,
    borderWidth: 1,
    elevation: 2,
  },
  cardImage: {
    resizeMode: "cover",
  },
  cardContent: {
    padding: 12,
    backgroundColor: colors.backgroundMain,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  cardActions: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: colors.backgroundMain,
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.accentGold,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  ratingText: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 4,
  },
});
