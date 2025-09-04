import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-qr-code";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "@/reduxs/store";
import { Header, Loading, Icon } from "@/components";
import {
  useGetUserTicketsQuery,
  useGenerateQrCodesMutation,
} from "@/reduxs/apis/orderItem.api";
import { myNavigation, colors, BASE_URL } from "@/utils";

// ✅ เพิ่ม Language Context และ Translation
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

interface TicketItem {
  orderItemId: string;
  orderId: string;
  refId: string;
  productName: string;
  description: string;
  priceEach: number;
  quantity: number;
  qrCode?: string;
  status: string;
  statusText: string;
  orderDate: string;
  usedAt?: string;
  images: Array<{
    imageId: string;
    refId: string;
    imageUrl: string;
    uploadedDate: string;
  }>;
}

const UserTicketsScreen = () => {
  const navigation = myNavigation();
  const user = useSelector((state: RootState) => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const userId = user?.userId;

  const { data, isLoading, error, refetch } = useGetUserTicketsQuery(
    { userId, pageSize: 20, currentPage },
    { skip: !userId }
  );

  const [generateQrCodes, { isLoading: isGenerating }] =
    useGenerateQrCodesMutation();

  // ✅ ใช้ภาษา
  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  // refresh เมื่อกลับมาหน้านี้
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        refetch();
      }
    }, [userId, refetch])
  );

  useEffect(() => {
    const checkUserData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedToken = await AsyncStorage.getItem("accessToken");
    };
    checkUserData();
  }, [userId]);

  // Data processing
  useEffect(() => {
    if (data && data.data) {
      try {
        let ticketData: any[] = [];

        if (data.data.$values && Array.isArray(data.data.$values)) {
          ticketData = data.data.$values;
        } else if (Array.isArray(data.data)) {
          ticketData = data.data;
        }

        if (ticketData.length > 0) {
          const ticketItems: TicketItem[] = ticketData.map((item: any) => ({
            ...item,
            images: Array.isArray(item.images)
              ? item.images.map((img: any) => ({
                  ...img,
                  imageUrl: img?.imageUrl
                    ? `${BASE_URL}${img.imageUrl}`
                    : undefined,
                }))
              : [],
          }));

          setTickets(ticketItems);
        } else {
          setTickets([]);
        }
      } catch (error) {
        setTickets([]);
      }
    } else {
      setTickets([]);
    }
  }, [data]);

  // Animations
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [tickets]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  // สร้าง QR Code
  const handleGenerateQrCode = async (orderId: string) => {
    try {
      await generateQrCodes(orderId).unwrap();
      await refetch();
    } catch (error) {}
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "0":
        return colors.warning; // รอชำระเงิน
      case "1":
        return colors.accentGreen; // ยังไม่ใช้
      case "2":
        return colors.textTertiary; // ใช้แล้ว
      case "3":
        return colors.error; // หมดอายุ
      case "4":
        return colors.warning; // ยกเลิก
      case "5":
        return colors.error; // ชำระเงินล้มเหลว
      default:
        return colors.textSecondary;
    }
  };

  const renderTicketCard = ({
    item,
    index,
  }: {
    item: TicketItem;
    index: number;
  }) => {
    return (
      <Animated.View
        style={[
          styles.ticketCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.white, colors.backgroundCard]}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.ticketInfo}>
              <Text style={styles.ticketTitle}>{item.productName}</Text>
              <Text style={styles.ticketDescription}>{item.description}</Text>

              <View style={styles.ticketMeta}>
                <Text style={styles.priceText}>
                  ฿{item.priceEach?.toLocaleString()}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.statusText}</Text>
                </View>
              </View>
            </View>

            {item.images && item.images.length > 0 && (
              <View style={styles.imageContainer}>
                <Animated.Image
                  source={{ uri: item.images[0].imageUrl }}
                  style={styles.ticketImage}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>

          {/* ปุ่มสร้าง QR Code เมื่อชำระเงินแล้วแต่ยังไม่มี QR */}
          {!item.qrCode && item.status === "1" && (
            <TouchableOpacity
              style={styles.generateQrButton}
              onPress={() => handleGenerateQrCode(item.orderId)}
              disabled={isGenerating}
            >
              <LinearGradient
                colors={[colors.accentGold, colors.accentGoldDark]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {isGenerating ? t("กำลังสร้าง_QR_Code") : t("สร้าง_QR_Code")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* แสดง QR Code สำหรับบัตรที่มี QR และยังไม่ได้ใช้ */}
          {item.qrCode && item.status === "1" && (
            <View style={styles.qrContainer}>
              <BlurView intensity={20} style={styles.qrBlur}>
                <View style={styles.qrCodeWrapper}>
                  <QRCode
                    value={item.qrCode}
                    size={120}
                    fgColor={colors.textPrimary}
                    bgColor={colors.white}
                  />
                </View>
                <Text style={styles.qrLabel}>
                  {t("แสดง_QR_Code_นี้ที่ประตูทางเข้า")}
                </Text>
              </BlurView>
            </View>
          )}

          <View style={styles.cardFooter}>
            <Text style={styles.orderDate}>
              {t("สั่งซื้อเมื่อ")}:{" "}
              {new Date(item.orderDate).toLocaleDateString("th-TH")}
            </Text>
            {item.usedAt && (
              <Text style={styles.usedDate}>
                {t("ใช้งานเมื่อ")}:{" "}
                {new Date(item.usedAt).toLocaleDateString("th-TH")}
              </Text>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Icon
        type="MaterialCommunityIcons"
        icon="ticket-outline"
        size={80}
        color={colors.textTertiary}
      />
      <Text style={styles.emptyTitle}>{t("ยังไม่มีบัตร")}</Text>
      <Text style={styles.emptyDescription}>
        {t("คุณยังไม่ได้ซื้อบัตรใด")}
        {"\n"}
        {t("ไปเลือกซื้อบัตรกันเถอะ")}
      </Text>
      <TouchableOpacity
        style={styles.goToTicketsButton}
        onPress={() => navigation.navigate("ตั๋ว")}
      >
        <LinearGradient
          colors={[colors.accentGold, colors.accentGoldDark]}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>{t("ไปซื้อบัตร")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  // Loading
  if (isLoading) return <Loading />;

  // Main
  return (
    <View style={styles.container}>
      {/* ✅ หัวข้อหน้า */}
      <Header options={{ title: t("บัตรของฉัน_title") }} />

      <FlatList
        data={tickets}
        keyExtractor={(item, index) => item?.orderItemId || `ticket-${index}`}
        renderItem={renderTicketCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          tickets.length === 0 && styles.emptyListContainer,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

export default UserTicketsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  ticketCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  ticketInfo: {
    flex: 1,
    paddingRight: 12,
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
  ticketMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.accentGold,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.white,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  ticketImage: {
    width: "100%",
    height: "100%",
  },
  generateQrButton: {
    marginVertical: 12,
    borderRadius: 25,
    overflow: "hidden",
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  qrBlur: {
    padding: 20,
    alignItems: "center",
  },
  qrCodeWrapper: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.platinum,
    paddingTop: 12,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  usedDate: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  goToTicketsButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
});
