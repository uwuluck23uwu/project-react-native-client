import { StyleSheet, View } from "react-native";
import { Button, Text, Avatar } from "react-native-paper";
import { colors, myNavigation } from "@/utils";

const ApplyScreen = () => {
  const { navigate } = myNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Avatar.Image
          source={require("@/../assets/icon.png")}
          size={150}
          style={styles.pandaImage}
        />

        <Text style={styles.title}>Chiang Mai Zoo</Text>

        <Text style={styles.subtitle}>
          ลงทะเบียนเพื่อเข้าใช้งานเว็บไซต์สวนสัตว์
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigate("สมัครสมาชิก")}
          style={styles.registerButton}
          labelStyle={styles.buttonText}
        >
          สมัครสมาชิก
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigate("เข้าสู่ระบบ")}
          style={styles.loginButton}
          labelStyle={styles.loginButtonText}
        >
          เข้าสู่ระบบ
        </Button>
      </View>
    </View>
  );
};

export default ApplyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  center: {
    alignItems: "center",
  },
  pandaImage: {
    marginBottom: 30,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  registerButton: {
    width: 250,
    borderRadius: 25,
    marginBottom: 15,
    backgroundColor: colors.accentGreen,
  },
  loginButton: {
    width: 250,
    borderRadius: 25,
    borderColor: colors.accentGreen,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.accentGreen,
  },
});
