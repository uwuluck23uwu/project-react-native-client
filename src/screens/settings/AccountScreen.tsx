import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import {
  TextInput,
  Button,
  Avatar,
  Text,
  IconButton,
} from "react-native-paper";
import { Loading } from "@/components";
import { RootState } from "@/reduxs/store";
import { myNavigation, colors } from "@/utils";

const AccountScreen = () => {
  const { navigate } = myNavigation();
  const user = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setImageUrl(user.imageUrl || null);
    }
  }, [user]);

  if (user === null) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={100}
          source={
            imageUrl ? { uri: imageUrl } : require("../../../assets/icon.png")
          }
          style={styles.image}
        />
        <IconButton
          icon="camera"
          size={24}
          style={styles.cameraIcon}
          iconColor={colors.accentGreen}
          onPress={() => {
            // TODO: เปิดกล้องหรือเลือกรูปจากเครื่อง
          }}
        />
        <Text style={styles.updateText}>อัปเดตรูปโปรไฟล์</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          label="ชื่อผู้ใช้"
          value={username}
          mode="outlined"
          style={styles.input}
          onChangeText={setUsername}
        />
        <TextInput
          label="อีเมล์"
          value={email}
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          label="เบอร์โทร"
          value={phone}
          mode="outlined"
          style={styles.input}
          onChangeText={setPhone}
        />
        <TextInput
          label="วันเกิด"
          value={birthday}
          mode="outlined"
          style={styles.input}
          onChangeText={setBirthday}
        />
      </View>

      <Button
        mode="contained"
        style={styles.confirmButton}
        onPress={() => {
          // TODO: ส่งข้อมูลที่แก้ไขไปยัง backend หรือ redux dispatch
        }}
        icon="pencil"
      >
        ยืนยัน
      </Button>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    backgroundColor: "transparent",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: colors.backgroundAlt,
  },
  updateText: {
    marginTop: 10,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    marginBottom: 10,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: colors.accentGreen,
  },
});
