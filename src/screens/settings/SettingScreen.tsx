import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, List, Divider } from "react-native-paper";
import { logout } from "@/reduxs/slices/auth.slice";
import { Loading } from "@/components";
import { RootState } from "@/reduxs/store";
import { myNavigation, colors } from "@/utils";

const SettingScreen = () => {
  const dispatch = useDispatch();
  const { navigate } = myNavigation();

  const user = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    navigate("สมาชิก");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("หน้าหลัก");
  };

  const userItem = user
    ? {
        title: "ข้อมูลผู้ใช้",
        description: "แก้ไขรายละเอียดโปรไฟล์",
        onPress: () => navigate("บัญชี"),
      }
    : {
        title: "กรุณาเข้าสู่ระบบ",
        description: null,
        onPress: handleLogin,
      };

  const isLoggedIn = user
    ? {
        text: "ออกจากระบบ",
        icon: "logout",
        action: handleLogout,
      }
    : {
        text: "เข้าสู่ระบบ",
        icon: "login",
        action: handleLogin,
      };

  if (user === null) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <List.Item
        style={styles.item}
        title={userItem.title}
        description={userItem.description}
        left={(props) => (
          <Avatar.Image
            {...props}
            source={require("../../../assets/icon.png")}
            style={styles.image}
          />
        )}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={userItem.onPress}
      />
      <Divider />

      <List.Item
        style={styles.item}
        title="การตั้งค่าภาษา"
        left={(props) => <List.Icon {...props} icon="earth" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => {}}
      />
      <Divider />

      <List.Item
        style={styles.item}
        title="ตั้งค่าการแจ้งเตือน"
        left={(props) => <List.Icon {...props} icon="bell" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => {}}
      />
      <Divider />

      <List.Item
        style={styles.item}
        title="ปรับแต่ง"
        left={(props) => <List.Icon {...props} icon="tune" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => {}}
      />
      <Divider />

      <List.Item
        style={styles.item}
        title="ช่วยเหลือและสนับสนุน"
        left={(props) => <List.Icon {...props} icon="help-circle" />}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => {}}
      />
      <Divider />

      <Button
        mode="contained"
        style={styles.logoutButton}
        onPress={isLoggedIn.action}
        icon={isLoggedIn.icon}
      >
        {isLoggedIn.text}
      </Button>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
    padding: 20,
  },
  item: {
    backgroundColor: colors.backgroundAlt,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  image: {
    backgroundColor: colors.secondary,
  },
  logoutButton: {
    backgroundColor: colors.accentGreen,
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 10,
  },
  logoutButtonLabel: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
