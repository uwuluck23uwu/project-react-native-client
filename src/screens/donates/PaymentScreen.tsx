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
  FlatList,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TextInput, Card, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { usePaymentSheet } from "@stripe/stripe-react-native";
import { Payment } from "@/interfaces/payment.interface";
import { PaymentValidation } from "@/validations/validation";
import { RootState } from "@/reduxs/store";
import { Header, Icon, PaymentItem } from "@/components";
import { colors, RootStackParamList, myNavigation } from "@/utils";
import { useCreateOrderMutation } from "@/reduxs/apis/order.api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

type Props = RouteProp<RootStackParamList, "ชำระเงิน">;

const PaymentScreen = () => {
  const route = useRoute<Props>();
  const { goBack } = myNavigation();
  const user = useSelector((state: RootState) => state.auth);

  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

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
      name: t("บัตรเครดิต_เดบิต"),
      icon: "creditcard",
      iconType: "AntDesign",
      color: colors.success,
      description: "Visa, MasterCard, JCB",
    },
    {
      id: "2",
      name: t("พร้อมเพย์"),
      icon: "qrcode-scan",
      iconType: "MaterialCommunityIcons",
      color: colors.warning,
      description: t("สแกน_QR_Code"),
    },
    {
      id: "3",
      name: t("โอนเงินผ่านธนาคาร"),
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

  const params = (route.params || {}) as any;
  const { title = "", price: priceParam = 0, items = [] } = params;

  const effectiveItems: { refId: string; quantity: number }[] = items || [];
  const isDonation = effectiveItems.length === 0;

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

      const orderPayload: any = {
        userId,
        currency: "thb",
        description: title || "ชำระค่าตั๋ว",
        paymentMethod: paymentMethodMap[selectedMethod],
        items: [],
      };

      if (isDonation) {
        const amount = parseFloat(form?.price || "0");
        if (!amount || Number.isNaN(amount))
          throw new Error("กรุณาใส่จำนวนเงินให้ถูกต้อง");

        orderPayload.items = [
          {
            refId: "DONATION",
            quantity: 1,
            priceEach: amount,
          },
        ];
      } else {
        orderPayload.items = effectiveItems.map((item) => ({
          refId: item.refId,
          quantity: item.quantity,
        }));
      }

      const res: any = await createOrder(orderPayload).unwrap();

      const orderId =
        res?.result?.orderId || res?.data?.orderId || res?.orderId;
      const clientSecret =
        res?.result?.clientSecret ||
        res?.data?.clientSecret ||
        res?.clientSecret;

      if (!clientSecret) {
        throw new Error("ไม่ได้รับ client secret จากเซิร์ฟเวอร์");
      }

      const { error: initErr } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "PrimoPiazza",
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: { name: auth?.name || "Guest" },
      });

      if (initErr) throw new Error(initErr.message);

      const { error: presentErr } = await presentPaymentSheet();
      if (presentErr) throw new Error(presentErr.message);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        goBack();
      }, 1200);
    } catch (e: any) {
      Alert.alert(
        "ชำระเงินไม่สำเร็จ",
        e?.message || e?.data?.message || String(e)
      );
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
            {/* ✅ แปลหัวข้อหน้า */}
            <Header options={{ title: t("ชำระเงิน") }} />

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
                        {/* ✅ แปลป้าย "จำนวนเงิน" */}
                        <Text style={styles.amountLabel}>{t("จำนวนเงิน")}</Text>
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
                            {/* ✅ แปล label ช่องกรอกเงินบริจาค */}
                            <TextInput
                              label={t("จำนวนเงินบริจาค")}
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

                  <Card style={styles.paymentMethodsCard}>
                    <Card.Content>
                      <View style={styles.sectionHeader}>
                        <Icon
                          type="MaterialCommunityIcons"
                          icon="credit-card-multiple"
                          size={24}
                          color={colors.primary}
                        />
                        {/* ✅ แปลหัวข้อส่วนเลือกวิธีชำระเงิน */}
                        <Text style={styles.sectionTitle}>
                          {t("เลือกช่องทางการชำระเงิน")}
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

                  <View style={styles.buttonContainer}>
                    <Button
                      mode="contained"
                      onPress={handleSubmit as any}
                      style={[
                        styles.paymentButton,
                        (!selectedMethod || isProcessing || isCreating) &&
                          styles.disabledButton,
                      ]}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonText}
                      icon={
                        !isProcessing && !isCreating
                          ? "shield-check"
                          : undefined
                      }
                      loading={isProcessing || isCreating}
                      disabled={!selectedMethod || isProcessing || isCreating}
                      buttonColor={
                        selectedMethod && !isProcessing && !isCreating
                          ? colors.primary
                          : colors.disabled
                      }
                    >
                      {/* ✅ แปลปุ่มชำระเงิน/กำลังดำเนินการ */}
                      {isProcessing || isCreating
                        ? t("กำลังดำเนินการ")
                        : t("ชำระเงิน")}
                    </Button>

                    <View style={styles.securityInfo}>
                      <Icon
                        type="MaterialCommunityIcons"
                        icon="security"
                        size={16}
                        color={colors.textSecondary}
                      />
                      {/* ✅ แปลข้อความความปลอดภัย */}
                      <Text style={styles.securityText}>
                        {t(
                          "การชำระเงินได้รับการปกป้องด้วยระบบความปลอดภัยระดับสูง"
                        )}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              )}
            </Formik>

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
                    {/* ✅ แปลข้อความสำเร็จ */}
                    <Text style={styles.successText}>
                      {t("ชำระเงินสำเร็จ")}
                    </Text>
                    <Text style={styles.successSubtext}>
                      {t("ขอบคุณสำหรับการสนับสนุน")}
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
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },

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
