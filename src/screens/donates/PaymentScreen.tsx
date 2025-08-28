import { useState, useRef, useEffect } from "react";
import { Formik } from "formik";
import { useSelector } from "react-redux";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
  FlatList,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TextInput, Card } from "react-native-paper";
import LottieView from "lottie-react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { usePaymentSheet } from "@stripe/stripe-react-native";

import { Payment } from "@/interfaces/payment.interface";
import { PaymentValidation } from "@/validations/validation";
import { RootState } from "@/reduxs/store";
import { Header, Icon, PaymentItem } from "@/components";
import { colors, RootStackParamList, myNavigation } from "@/utils";
import { useCreateOrderMutation } from "@/reduxs/apis/order.api";

type Props = RouteProp<RootStackParamList, "ชำระเงิน">;

const PaymentScreen = () => {
  const route = useRoute<Props>();
  const { goBack } = myNavigation();
  const user = useSelector((state: RootState) => state.auth);

  // Stripe PaymentSheet
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const payments: Payment[] = [
    {
      id: "1",
      name: "บัตรเครดิต/เดบิต",
      icon: "creditcard",
      iconType: "AntDesign",
      color: colors.success,
      description: "Visa, MasterCard, JCB",
    },
    {
      id: "2",
      name: "พร้อมเพย์",
      icon: "qrcode-scan",
      iconType: "MaterialCommunityIcons",
      color: colors.warning,
      description: "สแกน QR Code",
    },
    {
      id: "3",
      name: "โอนเงินผ่านธนาคาร",
      icon: "bank",
      iconType: "MaterialCommunityIcons",
      color: colors.info,
      description: "โอนผ่านแอปธนาคาร",
    },
    {
      id: "4",
      name: "TrueMoney Wallet",
      icon: "wallet",
      iconType: "AntDesign",
      color: colors.accentTerracotta,
      description: "จ่ายผ่านกระเป๋าเงิน",
    },
  ];

  // ----- รับ params จากหน้า Ticket -----
  const params = (route.params || {}) as any;
  const {
    title = "",
    price: priceParam = 0,
    items = [],
    ticketIds = [],
  } = params;

  // รองรับทั้งรูปแบบใหม่ (items: [{refId,quantity}]) และแบบเก่า (ticketIds: ["ID:QTY"])
  const legacyItems = (ticketIds || [])
    .map((s: string) => {
      const [refId, qtyStr] = (s || "").split(":");
      const q = parseInt(qtyStr || "0", 10);
      return refId ? { refId, quantity: isNaN(q) ? 0 : q } : null;
    })
    .filter(Boolean) as { refId: string; quantity: number }[];

  const effectiveItems: { refId: string; quantity: number }[] =
    Array.isArray(items) && items.length > 0 ? items : legacyItems;

  const isDonation = (effectiveItems?.length ?? 0) === 0;

  // ----- animations -----
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
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
    loop.start();
    return () => loop.stop();
  }, []);

  const handleMethodSelect = (id: string) => {
    setSelectedMethod(id);
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 120,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 0,
        tension: 120,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const paymentMethodMap: Record<string, string> = {
    "1": "card",
    "2": "promptpay",
    "3": "bank_transfer",
    "4": "truemoney",
  };

  // ---------- FLOW หลัก: Create order -> init sheet -> present ----------
  const handlePayment = async (form: { price: string }) => {
    if (!selectedMethod) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    try {
      setIsProcessing(true);

      const auth = user as any;
      const userId = auth?.userId ?? auth?.id ?? auth?.profile?.id;

      // payload ที่ backend ต้องการ
      const payload: any = {
        userId,
        currency: "thb",
        description: title || "ชำระค่าตั๋ว",
        paymentMethod: paymentMethodMap[selectedMethod],
        items: effectiveItems,
      };

      // โหมดบริจาค (ไม่มี items) -> ส่งยอดจากฟอร์ม
      if (isDonation) {
        const amount = parseFloat(form?.price || "0");
        if (!amount || Number.isNaN(amount))
          throw new Error("กรุณาใส่จำนวนเงินให้ถูกต้อง");
        payload.items = [{ refId: "DONATION", quantity: 1, priceEach: amount }];
      }

      // 1) เรียก API สร้าง Order + PaymentIntent
      const res: any = await createOrder(payload).unwrap();

      // 2) ดึง client secret (เผื่อหลายรูปแบบ)
      const clientSecret =
        res?.result?.clientSecret ||
        res?.data?.clientSecret ||
        res?.clientSecret ||
        res?.payment?.clientSecret;

      if (!clientSecret)
        throw new Error("ไม่ได้รับ client secret จากเซิร์ฟเวอร์");

      // 3) init PaymentSheet (โหมด PaymentIntent)
      const { error: initErr } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "PrimoPiazza",
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: { name: auth?.name || "Guest" },
      });
      if (initErr) throw new Error(initErr.message);

      // 4) present PaymentSheet
      const { error: presentErr } = await presentPaymentSheet();
      if (presentErr) throw new Error(presentErr.message);

      // 5) สำเร็จ -> โชว์ success สั้น ๆ แล้วเด้งกลับหน้าก่อน
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        goBack();
      }, 1200);
    } catch (e: any) {
      Alert.alert("ชำระเงินไม่สำเร็จ", e?.message ?? String(e));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={[colors.backgroundMain, colors.tuscanSkyLight]}
        style={styles.backgroundGradient}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Header options={{ title: "ชำระเงิน" }} />

            <Formik
              initialValues={{ price: String(priceParam || 0) }}
              validationSchema={isDonation ? PaymentValidation : undefined}
              onSubmit={handlePayment}
              enableReinitialize
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <Animated.View
                  style={[
                    styles.mainContent,
                    {
                      opacity: fadeAnim,
                      transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim },
                      ],
                    },
                  ]}
                >
                  {/* Amount */}
                  <Card style={styles.amountCard}>
                    <LinearGradient
                      colors={[colors.white, colors.cream]}
                      style={styles.amountCardGradient}
                    >
                      <Card.Content style={styles.amountContent}>
                        <View style={styles.amountIconContainer}>
                          <Icon
                            type="MaterialCommunityIcons"
                            icon="credit-card-outline"
                            size={50}
                            color={colors.accentGold}
                          />
                        </View>
                        <Text style={styles.amountLabel}>จำนวนเงิน</Text>
                        <Animated.Text
                          style={[
                            styles.amountValue,
                            { transform: [{ scale: pulseAnim }] },
                          ]}
                        >
                          ฿
                          {parseFloat(values.price || "0").toLocaleString(
                            "th-TH",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </Animated.Text>

                        {isDonation && (
                          <View style={styles.inputSection}>
                            <TextInput
                              label="จำนวนเงินบริจาค"
                              mode="outlined"
                              style={styles.input}
                              keyboardType="numeric"
                              onChangeText={handleChange("price")}
                              onBlur={handleBlur("price")}
                              value={values.price}
                              error={touched.price && !!errors.price}
                              right={<TextInput.Icon icon="currency-thb" />}
                              theme={{
                                colors: {
                                  primary: colors.primary,
                                  outline: colors.primary,
                                },
                              }}
                            />
                            {errors.price && touched.price && (
                              <Animated.Text style={styles.errorText}>
                                {errors.price}
                              </Animated.Text>
                            )}
                          </View>
                        )}
                      </Card.Content>
                    </LinearGradient>
                  </Card>

                  {/* Payment methods */}
                  <Card style={styles.paymentMethodsCard}>
                    <Card.Content>
                      <View style={styles.sectionHeader}>
                        <Icon
                          type="MaterialCommunityIcons"
                          icon="credit-card-multiple"
                          size={24}
                          color={colors.primary}
                        />
                        <Text style={styles.sectionTitle}>
                          เลือกช่องทางการชำระเงิน
                        </Text>
                      </View>

                      <FlatList
                        data={payments}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                          <PaymentItem
                            item={item}
                            index={index}
                            isSelected={selectedMethod === item.id}
                            onSelect={handleMethodSelect}
                            bounceAnim={bounceAnim}
                          />
                        )}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                      />
                    </Card.Content>
                  </Card>

                  {/* Pay button */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.paymentButton,
                        (!selectedMethod || isProcessing || isCreating) &&
                          styles.disabledButton,
                      ]}
                      onPress={handleSubmit as any}
                      disabled={!selectedMethod || isProcessing || isCreating}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={
                          selectedMethod && !isProcessing && !isCreating
                            ? [colors.primary, colors.primaryLight]
                            : [colors.disabled, colors.silver]
                        }
                        style={styles.buttonGradient}
                      >
                        {isProcessing || isCreating ? (
                          <View style={styles.processingContainer}>
                            <LottieView
                              source={require("@/../assets/animations/loading.json")}
                              autoPlay
                              loop
                              style={styles.loadingAnimation}
                            />
                            <Text style={styles.buttonText}>
                              กำลังดำเนินการ...
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.buttonContent}>
                            <Icon
                              type="MaterialCommunityIcons"
                              icon="shield-check"
                              size={20}
                              color={colors.white}
                            />
                            <Text style={styles.buttonText}>ชำระเงิน</Text>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.securityInfo}>
                      <Icon
                        type="MaterialCommunityIcons"
                        icon="security"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.securityText}>
                        การชำระเงินได้รับการปกป้องด้วยระบบความปลอดภัยระดับสูง
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              )}
            </Formik>

            {/* Success overlay */}
            {showSuccess && (
              <Animated.View style={styles.successOverlay}>
                <LinearGradient
                  colors={[colors.black80, colors.black60]}
                  style={styles.successBackground}
                >
                  <View style={styles.successContent}>
                    <LottieView
                      source={require("@/../assets/animations/loading.json")}
                      autoPlay
                      loop={false}
                      style={styles.successAnimation}
                    />
                    <Text style={styles.successText}>ชำระเงินสำเร็จ!</Text>
                    <Text style={styles.successSubtext}>
                      ขอบคุณสำหรับการสนับสนุน Primo Piazza
                    </Text>
                    <View style={styles.successIcons}>
                      <Icon
                        type="AntDesign"
                        icon="heart"
                        size={20}
                        color={colors.accentTerracotta}
                      />
                      <Icon
                        type="MaterialCommunityIcons"
                        icon="castle"
                        size={24}
                        color={colors.accentGold}
                      />
                      <Icon
                        type="AntDesign"
                        icon="heart"
                        size={20}
                        color={colors.accentTerracotta}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundGradient: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  mainContent: { flex: 1, padding: 16 },

  amountCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  amountCardGradient: { borderRadius: 20 },
  amountContent: { alignItems: "center", padding: 28 },
  amountIconContainer: { marginBottom: 12 },
  amountLabel: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 12,
    fontWeight: "600",
  },
  amountValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
    letterSpacing: 1,
  },
  inputSection: { width: "100%", marginTop: 20 },
  input: { backgroundColor: colors.white, fontSize: 16 },

  paymentMethodsCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 6,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    backgroundColor: colors.white,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginLeft: 12,
  },

  buttonContainer: { marginTop: 20 },
  paymentButton: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: { elevation: 3 },
  buttonGradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: { flexDirection: "row", alignItems: "center" },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginLeft: 12,
  },
  processingContainer: { flexDirection: "row", alignItems: "center" },
  loadingAnimation: { width: 28, height: 28, marginRight: 12 },

  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  securityText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginLeft: 8,
    flex: 1,
  },

  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  successBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successContent: {
    backgroundColor: colors.white,
    padding: 40,
    borderRadius: 24,
    alignItems: "center",
    margin: 32,
    elevation: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  successAnimation: { width: 120, height: 120 },
  successText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.success,
    marginTop: 20,
    textAlign: "center",
  },
  successSubtext: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
  successIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },

  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    alignSelf: "flex-start",
    fontWeight: "500",
  },
});
