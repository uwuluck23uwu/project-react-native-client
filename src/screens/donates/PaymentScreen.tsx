import { useState, useRef, useEffect } from "react";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
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
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TextInput, Avatar, Card } from "react-native-paper";
import LottieView from "lottie-react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Payment } from "@/interfaces/payment.interface";
import { PaymentValidation } from "@/validations/validation";
import { AppDispatch, RootState } from "@/reduxs/store";
import { Header, Loading, Icon, PaymentItem } from "@/components";
import { myNavigation, colors, RootStackParamList } from "@/utils";

const { width, height } = Dimensions.get("window");

type Props = RouteProp<RootStackParamList, "ชำระเงิน">;

const PaymentScreen = () => {
  const route = useRoute<Props>();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = myNavigation();

  const user = useSelector((state: RootState) => state.auth);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [payment] = useState<Payment[]>([
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
  ]);

  const {
    title = "",
    animalId = "0",
    donationTypeId = "0",
    price = "0",
    ticketIds = [],
  } = route.params || {};

  // Initialize animations
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

    // Pulse animation for amount
    const pulseAnimation = Animated.loop(
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
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);

    // Bounce animation for selection
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

  const handlePayment = async () => {
    if (!selectedMethod) {
      // Show error animation
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

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);

      // Auto hide success after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        // Navigate to success page or back
      }, 3000);
    }, 3000);
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
              initialValues={{ price: price.toString() }}
              validationSchema={PaymentValidation}
              onSubmit={handlePayment}
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
                  {/* Amount Section */}
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
                            {
                              transform: [{ scale: pulseAnim }],
                            },
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

                        {ticketIds.length === 0 && (
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

                  {/* Payment Methods */}
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
                        data={payment}
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

                  {/* Payment Button */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.paymentButton,
                        !selectedMethod && styles.disabledButton,
                      ]}
                      onPress={() => handleSubmit}
                      disabled={!selectedMethod || isProcessing}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={
                          selectedMethod && !isProcessing
                            ? [colors.primary, colors.primaryLight]
                            : [colors.disabled, colors.silver]
                        }
                        style={styles.buttonGradient}
                      >
                        {isProcessing ? (
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
                            <Text style={styles.buttonText}>
                              ชำระเงินอย่างปลอดภัย
                            </Text>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Security Info */}
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

            {/* Success Overlay */}
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
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },

  // Amount Card Styles
  amountCard: {
    marginBottom: 16,
    borderRadius: 20,
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  amountCardGradient: {
    borderRadius: 20,
  },
  amountContent: {
    alignItems: "center",
    padding: 28,
  },
  amountIconContainer: {
    marginBottom: 12,
  },
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
  inputSection: {
    width: "100%",
    marginTop: 20,
  },
  input: {
    backgroundColor: colors.white,
    fontSize: 16,
  },

  // Payment Methods Card
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

  // Button Styles
  buttonContainer: {
    marginTop: 20,
  },
  paymentButton: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    elevation: 3,
  },
  buttonGradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginLeft: 12,
  },
  processingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingAnimation: {
    width: 28,
    height: 28,
    marginRight: 12,
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

  // Success Overlay
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
  successAnimation: {
    width: 120,
    height: 120,
  },
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

  // Error Text
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    alignSelf: "flex-start",
    fontWeight: "500",
  },
});
