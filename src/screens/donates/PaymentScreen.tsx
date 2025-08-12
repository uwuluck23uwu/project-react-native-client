import { useState } from "react";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { Text, TextInput, Button, Avatar } from "react-native-paper";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Header, Loading } from "@/components";
import { PaymentValidation } from "@/validations/validation";
import { AppDispatch, RootState } from "@/reduxs/store";
import { myNavigation, colors, RootStackParamList } from "@/utils";

type Props = RouteProp<RootStackParamList, "ชำระเงิน">;

const PaymentScreen = () => {
  const route = useRoute<Props>();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = myNavigation();

  const user = useSelector((state: RootState) => state.auth);
  // const { payment, status } = useSelector((state: RootState) => state.payment);

  const [selectedMethod, setSelectedMethod] = useState("");
  const [payment, setPayment] = useState([
    {
      id: "1",
      name: "บัตรเครดิต",
      image: "https://example.com/credit-card.png",
    },
    { id: "2", name: "พร้อมเพย์", image: "https://example.com/prompay.png" },
    {
      id: "3",
      name: "โอนเงินผ่านธนาคาร",
      image: "https://example.com/bank-transfer.png",
    },
  ]);

  const {
    title = "",
    animalId = "0",
    donationTypeId = "0",
    price = "0",
    ticketIds = [],
  } = route.params || {};

  const handlePayment = async () => {
    console.log("Processing payment...");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              <View>
                <View style={styles.content}>
                  <Avatar.Image
                    source={{
                      uri: "https://i.pinimg.com/736x/2d/3c/0e/2d3c0eae2ceeb5c2962083c262a5b094.jpg",
                    }}
                    size={400}
                  />

                  <Text variant="titleLarge" style={styles.textAmount}>
                    จำนวนเงิน
                  </Text>
                  <Text style={styles.money}>${values.price || "0.00"}</Text>
                  {ticketIds.length == 0 && (
                    <>
                      <Text style={styles.paymentTitle}>
                        โปรดป้อน จำนวนเงิน
                      </Text>

                      <TextInput
                        label="จำนวนเงินบริจาค"
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={handleChange("price")}
                        onBlur={handleBlur("price")}
                        value={values.price}
                        error={touched.price && !!errors.price}
                      />
                      {errors.price && touched.price && (
                        <Text style={styles.errorText}>{errors.price}</Text>
                      )}
                    </>
                  )}
                </View>

                <View style={styles.paymentOptions}>
                  <Text style={styles.paymentTitle}>
                    โปรดเลือก ช่องทางการชำระเงิน
                  </Text>
                  <FlatList
                    data={payment}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.paymentButton,
                          selectedMethod === item.id && styles.selectedButton,
                        ]}
                        onPress={() => setSelectedMethod(item.id)}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={styles.paymentIcon}
                        />
                        <Text style={styles.paymentText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    icon="paw"
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    onPress={() => handleSubmit()}
                  >
                    ชำระเงิน
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  content: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 0,
  },
  textAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: colors.textPrimary,
  },
  money: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 5,
    color: colors.accentGreen,
  },
  input: {
    width: "100%",
    backgroundColor: colors.backgroundAlt,
  },
  buttonContainer: {
    width: "100%",
    padding: 20,
  },
  button: {
    width: "100%",
    backgroundColor: colors.accentGreen,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  paymentOptions: {
    padding: 20,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 10,
    color: colors.textPrimary,
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.platinum,
  },
  selectedButton: {
    borderColor: colors.accentGold,
    borderWidth: 2,
    backgroundColor: "#FFF8E1", // อ่อนโยนแบบทองอ่อน
  },
  paymentIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  paymentText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
});
