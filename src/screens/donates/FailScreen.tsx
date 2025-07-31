import { StyleSheet, View } from "react-native";
import { Button, Text, Avatar } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Header } from "@/components";
import { colors, myNavigation, RootStackParamList } from "@/utils";

type Props = RouteProp<RootStackParamList, "ล้มเหลว">;

const FailScreen = () => {
  const navigation = myNavigation();
  const route = useRoute<Props>();
  const { title = "" } = route.params || {};

  return (
    <View style={styles.container}>
      <Header options={{ title: "ล้มเหลว" }} />

      <View style={styles.scrollContainer}>
        <View style={styles.content}>
          <Avatar.Image
            source={{
              uri: "https://i.pinimg.com/736x/50/76/48/507648ee971801de79fa1a69c55545d1.jpg",
            }}
            size={400}
          />

          <Text style={styles.title}>ชำระเงินล้มเหลว!</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("หน้าหลัก")}
            style={styles.buttonHome}
            labelStyle={styles.buttonText}
          >
            หน้าหลัก
          </Button>

          <Button
            mode="contained"
            onPress={() => {
              if (title == "TicketScreen") {
                navigation.navigate("ตั๋ว");
              } else {
                navigation.navigate("บริจาค");
              }
            }}
            style={styles.buttonDonate}
            labelStyle={styles.buttonText}
          >
            ดำเนินการอีกครั้ง
          </Button>
        </View>
      </View>
    </View>
  );
};

export default FailScreen;

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
    marginTop: 40,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    padding: 20,
  },
  buttonHome: {
    marginTop: 20,
    width: "100%",
    backgroundColor: colors.accentGreen,
    borderRadius: 10,
  },
  buttonDonate: {
    marginTop: 10,
    width: "100%",
    backgroundColor: colors.accentGold,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
});
