import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useScanTicketMutation } from "@/reduxs/apis/orderItem.api";
import { Header, Icon } from "@/components";
import { colors, myNavigation } from "@/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const TicketScannerScreen = () => {
  const navigation = myNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [scanTicket] = useScanTicketMutation();

  // ✅ ใช้ภาษา
  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  useEffect(() => {
    // Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for scanner frame
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, []);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    const now = Date.now();

    // Prevent multiple scans within 2 seconds
    if (now - lastScanTime < 2000) {
      return;
    }

    if (scanned || isProcessing) {
      return;
    }

    setScanned(true);
    setIsProcessing(true);
    setLastScanTime(now);

    try {
      // For demo purposes, using a dummy staff ID
      // In real app, get this from authenticated staff user
      const staffId = "ST001";

      const result = await scanTicket({
        qrCode: data,
        staffId: staffId,
      }).unwrap();

      if (result.success) {
        Alert.alert(
          t("สแกนสำเร็จ"),
          `${t("ลูกค้า")}: ${result.customerName}\n${t("บัตร")}: ${
            result.productName
          }\n${t("ราคา")}: ฿${result.price?.toLocaleString()}\n${t(
            "เวลา"
          )}: ${new Date(result.scanDateTime).toLocaleString("th-TH")}`,
          [
            {
              text: t("สแกนต่อ"),
              onPress: () => {
                setScanned(false);
                setIsProcessing(false);
              },
            },
            {
              text: t("กลับ"),
              onPress: () => navigation.goBack(),
              style: "cancel",
            },
          ]
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || t("เกิดข้อผิดพลาด");

      Alert.alert(t("ไม่สามารถสแกนได้"), errorMessage, [
        {
          text: t("ลองอีกครั้ง"),
          onPress: () => {
            setScanned(false);
            setIsProcessing(false);
          },
        },
      ]);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Header options={{ title: t("สแกน_QR_Code") }} />
        <View style={styles.centerContainer}>
          <Icon
            type="MaterialCommunityIcons"
            icon="camera"
            size={80}
            color={colors.textTertiary}
          />
          <Text style={styles.statusText}>{t("กำลังขออนุญาตใช้กล้อง")}</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Header options={{ title: t("สแกน_QR_Code") }} />
        <View style={styles.centerContainer}>
          <Icon
            type="MaterialCommunityIcons"
            icon="camera-off"
            size={80}
            color={colors.error}
          />
          <Text style={styles.statusText}>{t("ไม่อนุญาตให้ใช้กล้อง")}</Text>
          <Text style={styles.statusSubText}>
            {t("กรุณาไปที่การตั้งค่าเพื่ออนุญาตการใช้งานกล้อง")}
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{t("ขออนุญาตอีกครั้ง")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header options={{ title: t("สแกน_QR_Code") }} />

      <Animated.View
        style={[
          styles.cameraContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Top overlay */}
          <BlurView intensity={50} style={styles.overlayTop}>
            <Text style={styles.instructionText}>
              {t("วาง_QR_Code_ในกรอบเพื่อสแกน")}
            </Text>
          </BlurView>

          {/* Scanner frame */}
          <View style={styles.scannerRow}>
            <BlurView intensity={50} style={styles.overlaySide} />

            <Animated.View
              style={[
                styles.scannerFrame,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.scannerCorners}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>

              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <BlurView intensity={80} style={styles.processingBlur}>
                    <Icon
                      type="MaterialCommunityIcons"
                      icon="loading"
                      size={40}
                      color={colors.accentGold}
                    />
                    <Text style={styles.processingText}>
                      {t("กำลังตรวจสอบ")}
                    </Text>
                  </BlurView>
                </View>
              )}
            </Animated.View>

            <BlurView intensity={50} style={styles.overlaySide} />
          </View>

          {/* Bottom overlay */}
          <BlurView intensity={50} style={styles.overlayBottom}>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.goBack()}
              >
                <LinearGradient
                  colors={[colors.textTertiary, colors.textSecondary]}
                  style={styles.actionButtonGradient}
                >
                  <Icon
                    type="Ionicons"
                    icon="arrow-back"
                    size={24}
                    color={colors.white}
                  />
                  <Text style={styles.actionButtonText}>{t("กลับ")}</Text>
                </LinearGradient>
              </TouchableOpacity>

              {scanned && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setScanned(false);
                    setIsProcessing(false);
                  }}
                >
                  <LinearGradient
                    colors={[colors.accentGreen, colors.accentGreenDark]}
                    style={styles.actionButtonGradient}
                  >
                    <Icon
                      type="MaterialCommunityIcons"
                      icon="qrcode-scan"
                      size={24}
                      color={colors.white}
                    />
                    <Text style={styles.actionButtonText}>{t("สแกนใหม่")}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </View>
      </Animated.View>
    </View>
  );
};

export default TicketScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  statusSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  permissionButton: {
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
  cameraContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  overlayTop: {
    height: SCREEN_HEIGHT * 0.15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  overlayBottom: {
    height: SCREEN_HEIGHT * 0.15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scannerRow: {
    flexDirection: "row",
    flex: 1,
  },
  overlaySide: {
    flex: 1,
  },
  scannerFrame: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    position: "relative",
  },
  scannerCorners: {
    ...StyleSheet.absoluteFillObject,
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: colors.accentGold,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  processingBlur: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  processingText: {
    fontSize: 16,
    color: colors.white,
    marginTop: 8,
    fontWeight: "600",
  },
  instructionText: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  actionButton: {
    borderRadius: 20,
    overflow: "hidden",
    minWidth: 100,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    marginLeft: 8,
  },
});
