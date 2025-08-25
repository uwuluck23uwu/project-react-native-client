import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ticket } from "@/interfaces/ticket.interface";
import { RootState } from "@/reduxs/store";
import { startRealtime } from "@/realtime";
import { useGetTicketsQuery } from "@/reduxs/apis/ticket.api";
import { Header, Loading, TicketCard } from "@/components";
import { myNavigation, colors, BASE_URL } from "@/utils";

const TicketScreen = () => {
  const navigation = myNavigation();

  const { data, isLoading } = useGetTicketsQuery({});
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.auth.accessToken
  );

  const scrollY = useSharedValue(0);
  const fabScale = useSharedValue(0);
  const resetFabScale = useSharedValue(0);

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedTotal, setSelectedTotal] = useState(0);

  const tickets: Ticket[] = (data?.data?.$values ?? []).map((t: any) => {
    const images = (t.images?.$values ?? []).map((img: any) => ({
      ...img,
      imageUrl: img?.imageUrl ? `${BASE_URL}${img.imageUrl}` : undefined,
    }));

    return {
      ...t,
      images,
    } as Ticket;
  });

  useEffect(() => {
    const stop = startRealtime();
    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    const total = tickets.reduce((sum, item) => {
      const quantity = quantities[item.ticketId] || 0;
      return sum + quantity * (item.price || 0);
    }, 0);
    setSelectedTotal(total);

    const hasItems = Object.values(quantities).some((q) => q > 0);
    fabScale.value = withSpring(hasItems ? 1 : 0);
    resetFabScale.value = withSpring(hasItems ? 1 : 0);
  }, [quantities]);

  const increaseQuantity = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const resetQuantities = () => {
    setQuantities({});
  };

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fabScale.value }],
      opacity: fabScale.value,
    };
  });

  const resetFabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: resetFabScale.value }],
      opacity: resetFabScale.value,
    };
  });

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <Header options={{ title: "ตั๋ว" }} />

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.ticketId}
        renderItem={({ item, index }) => (
          <TicketCard
            item={item}
            index={index}
            quantity={quantities[item.ticketId] || 0}
            onIncrease={() => increaseQuantity(item.ticketId)}
            onDecrease={() => decreaseQuantity(item.ticketId)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onScroll={({ nativeEvent }) => {
          scrollY.value = nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      />

      <Animated.View style={[styles.fabContainer, fabAnimatedStyle]}>
        <BlurView intensity={20} style={styles.fabBlur}>
          <LinearGradient
            colors={[colors.accentGreen, colors.accentGreenDark]}
            style={styles.fabGradient}
          >
            <TouchableOpacity
              style={styles.fabButton}
              onPress={() => {
                // ดักคนที่ยังไม่เข้าสู่ระบบ
                if (!isLoggedIn) {
                  navigation.navigate("สมาชิก");
                  return;
                }

                // ถ้าเข้าสู่ระบบแล้วทำงานเดิม
                const selectedTickets = Object.entries(quantities)
                  .filter(([_, qty]) => qty > 0)
                  .map(([id, qty]) => `${id}:${qty}`);

                navigation.navigate("ชำระเงิน", {
                  title: "TicketScreen",
                  price: selectedTotal,
                  ticketIds: selectedTickets,
                });
              }}
            >
              <Text style={styles.fabText}>ชำระเงิน</Text>
              <Text style={styles.fabSubText}>
                ฿{selectedTotal.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </BlurView>
      </Animated.View>

      <Animated.View style={[styles.resetFabContainer, resetFabAnimatedStyle]}>
        <TouchableOpacity style={styles.resetFab} onPress={resetQuantities}>
          <LinearGradient
            colors={[colors.accentGold, colors.accentGoldDark]}
            style={styles.resetFabGradient}
          >
            <Text style={styles.resetFabText}>ยกเลิก</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default TicketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },

  listContainer: {
    padding: 16,
    paddingBottom: 120,
  },

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
  placeholderText: {
    fontSize: 40,
    opacity: 0.5,
  },
  priceBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 20,
    overflow: "hidden",
  },
  priceBadgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textPrimary,
  },

  contentSection: {
    flex: 1,
    justifyContent: "space-between",
  },
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

  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    borderRadius: 30,
    overflow: "hidden",
  },
  fabBlur: {
    borderRadius: 30,
  },
  fabGradient: {
    borderRadius: 30,
  },
  fabButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 2,
  },
  fabSubText: {
    fontSize: 14,
    color: colors.cream,
  },

  resetFabContainer: {
    position: "absolute",
    left: 20,
    bottom: 20,
  },
  resetFab: {
    borderRadius: 25,
    overflow: "hidden",
  },
  resetFabGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resetFabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
  },
});
