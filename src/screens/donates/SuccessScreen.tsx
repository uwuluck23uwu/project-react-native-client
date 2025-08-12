import { StyleSheet, View } from "react-native";
import { Button, Text, Avatar } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Header } from "@/components";
import { colors, myNavigation, RootStackParamList } from "@/utils";

type Props = RouteProp<RootStackParamList, "เสร็จสิน">;

const SuccessScreen = () => {
  const route = useRoute<Props>();
  const { navigate } = myNavigation();
  const { title = "" } = route.params || {};

  return (
    <View style={styles.container}>
      <Header options={{ title: "เสร็จสิน" }} />

      <View style={styles.scrollContainer}>
        <View style={styles.content}>
          <Avatar.Image
            source={{
              uri: "https://i.pinimg.com/736x/08/f7/4b/08f74b917aa452add50b02a12ad7216c.jpg",
            }}
            size={400}
          />

          <Text style={styles.title}>ชำระเงินเรียบร้อยแล้ว!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="paw"
            onPress={() => {
              navigate("ตั๋ว");
            }}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            ดำเนินการต่อ
          </Button>
        </View>
      </View>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 20,
    backgroundColor: colors.backgroundAlt,
  },
  content: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 100,
  },
  buttonContainer: {
    width: "100%",
    padding: 20,
  },
  button: {
    borderRadius: 8,
    backgroundColor: colors.accentGreen,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
