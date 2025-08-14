import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Surface } from "react-native-paper";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeInUp,
  SlideInRight,
  BounceIn,
  ZoomIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/utils";
import { Ticket } from "@/interfaces/ticket.interface";

const AnimatedCard = Animated.createAnimatedComponent(Card);

interface Props {
  item: Ticket;
  index: number;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const TicketCard: React.FC<Props> = ({
  item,
  index,
  quantity,
  onIncrease,
  onDecrease,
}) => {
  const totalPrice = (item.price ?? 0) * quantity;

  // ✅ ใช้ URL ของรูปตัวแรกในอาร์เรย์ (ถ้ามี)
  const imageUrl = item.images?.[0]?.imageUrl ?? null;

  return (
    <AnimatedCard
      style={styles.ticketCard}
      entering={FadeInDown.delay(index * 100).springify()}
      mode="elevated"
    >
      <LinearGradient
        colors={[colors.white, colors.backgroundCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          {/* รูป */}
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Animated.Image
                source={{ uri: imageUrl }}
                style={styles.ticketImage}
                entering={ZoomIn.delay(index * 150)}
              />
            ) : (
              <Animated.View
                style={[
                  styles.imagePlaceholder,
                  { backgroundColor: colors.platinum },
                ]}
                entering={ZoomIn.delay(index * 150)}
              >
                <Text style={styles.placeholderText}>🎫</Text>
              </Animated.View>
            )}

            {/* ป้ายราคา */}
            <Animated.View
              style={styles.priceBadge}
              entering={BounceIn.delay(index * 200)}
            >
              <LinearGradient
                colors={[colors.accentGold, colors.accentGoldLight]}
                style={styles.priceBadgeGradient}
              >
                <Text style={styles.priceText}>
                  ฿{(item.price ?? 0).toLocaleString()}
                </Text>
              </LinearGradient>
            </Animated.View>
          </View>

          {/* เนื้อหา */}
          <View style={styles.contentSection}>
            <Animated.Text
              style={styles.ticketTitle}
              entering={FadeInRight.delay(index * 100)}
            >
              {item.ticketType}
            </Animated.Text>

            {!!item.description && (
              <Animated.Text
                style={styles.ticketDescription}
                entering={FadeInRight.delay(index * 150)}
                numberOfLines={2}
              >
                {item.description}
              </Animated.Text>
            )}

            <Animated.View
              style={styles.quantityContainer}
              entering={SlideInRight.delay(index * 200)}
            >
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  {
                    backgroundColor:
                      quantity > 0 ? colors.error : colors.disabled,
                  },
                ]}
                onPress={onDecrease}
                disabled={quantity === 0}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <Surface style={styles.quantityDisplay} elevation={2}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </Surface>

              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  { backgroundColor: colors.accentGreen },
                ]}
                onPress={onIncrease}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </Animated.View>

            {quantity > 0 && (
              <Animated.View
                style={styles.itemTotalContainer}
                entering={FadeInUp.springify()}
              >
                <Text style={styles.itemTotalText}>
                  รวม: ฿{totalPrice.toLocaleString()}
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      </LinearGradient>
    </AnimatedCard>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  ticketCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: { flex: 1 },
  cardContent: { flexDirection: "row", padding: 16 },

  imageContainer: {
    width: 120,
    height: 120,
    marginRight: 16,
    position: "relative",
  },
  ticketImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: colors.platinum,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 40, opacity: 0.5 },

  priceBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 20,
    overflow: "hidden",
  },
  priceBadgeGradient: { paddingHorizontal: 12, paddingVertical: 6 },
  priceText: { fontSize: 12, fontWeight: "bold", color: colors.textPrimary },

  contentSection: { flex: 1, justifyContent: "space-between" },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  ticketDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  quantityDisplay: {
    minWidth: 50,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
    backgroundColor: colors.white,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  itemTotalContainer: {
    alignSelf: "flex-end",
  },
  itemTotalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.accentGreen,
  },
});
