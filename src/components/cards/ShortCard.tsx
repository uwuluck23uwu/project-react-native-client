import { StyleSheet, Pressable } from "react-native";
import { Card, Paragraph, Title, IconButton } from "react-native-paper";
import { colors } from "@/utils";

export const ShortCard = ({ data, onPress }: any) => {
  const { name, image, description, breed, rating } = data;

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.cardContainer}>
        <Card.Cover source={{ uri: image }} style={styles.cardImage} />
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>{name || "ไม่ระบุชื่อ"}</Title>
          <Paragraph style={styles.paragraph}>
            สายพันธุ์: {breed || "ไม่ระบุสายพันธุ์"}
          </Paragraph>
          <Paragraph style={styles.paragraph}>
            {description || "ไม่มีข้อมูลเพิ่มเติม"}
          </Paragraph>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <IconButton icon="star" iconColor={colors.accentGold} size={16} />
          <Paragraph style={styles.ratingText}>{rating || 0}</Paragraph>
        </Card.Actions>
      </Card>
    </Pressable>
  );
};

export default ShortCard;

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
    marginRight: 10,
    backgroundColor: colors.backgroundMain,
    borderRadius: 12,
    borderColor: colors.platinum,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
  },
  cardImage: {
    height: 160,
    resizeMode: "cover",
  },
  cardContent: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: colors.backgroundAlt,
  },
  ratingText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 4,
  },
});
