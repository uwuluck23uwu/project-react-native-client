import { useSelector } from "react-redux";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { RootState } from "@/reduxs/store";
import { myNavigation, colors } from "@/utils";

const HomeHeader = () => {
  const { navigate } = myNavigation();
  const user = useSelector((state: RootState) => state.auth);

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (user) {
              navigate("บัญชี");
            } else {
              navigate("สมาชิก");
            }
          }}
        >
          <Image
            source={require("@/../assets/icon.png")}
            style={styles.profileImage}
          />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Primo Piazza</Text>
          <Text style={styles.headerSubtitle}>
            ยินดีต้อนรับสู่อิตาลีใจกลางเขาใหญ่ 🍃
          </Text>
        </View>

        {!user && (
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigate("สมาชิก")}
          >
            <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundMain,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "transparent",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  registerButton: {
    backgroundColor: colors.accentGreen,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minWidth: 100,
    alignItems: "center",
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});
