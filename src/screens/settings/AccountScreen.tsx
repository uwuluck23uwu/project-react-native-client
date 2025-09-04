import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import {
  TextInput,
  Button,
  Avatar,
  Text,
  IconButton,
  Card,
  Surface,
  Chip,
  Divider,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Header } from "@/components";
import AlertModal from "@/components/modals/AlertModal";
import { RootState } from "@/reduxs/store";
import { setCredentials } from "@/reduxs/slices/auth.slice";
import { useUpdateUserMutation } from "@/reduxs/apis/auth.api";
import { myNavigation, BASE_URL } from "@/utils";
import colors, { gradients } from "@/utils/colors";

const { width, height } = Dimensions.get("window");

interface SelectedImage {
  uri: string;
  type: string;
  fileName: string;
}

const AccountScreen = () => {
  const { navigate } = myNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // เพิ่ม state สำหรับ AlertModal
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info" | "confirm"
  >("info");
  const [alertButtons, setAlertButtons] = useState<any[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const profileScaleAnim = useRef(new Animated.Value(0.8)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ฟังก์ชันสำหรับแสดง AlertModal
  const showAlert = (
    title: string,
    message: string,
    type: "success" | "error" | "warning" | "info" | "confirm" = "info",
    buttons: any[] = [{ text: "ตกลง", style: "default" }]
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertButtons(buttons);
    setAlertVisible(true);
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();

    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setImageUrl(user.imageUrl || null);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(profileScaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerLoop.start();
    floatLoop.start();
    pulseLoop.start();

    return () => {
      shimmerLoop.stop();
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [user]);

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7, // ลดคุณภาพเล็กน้อยเพื่อลดขนาดไฟล์
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // ตรวจสอบขนาดไฟล์ (5MB)
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          showAlert(
            "ไฟล์ใหญ่เกินไป",
            "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB",
            "warning"
          );
          return;
        }

        const newSelectedImage: SelectedImage = {
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          fileName: asset.fileName || `profile_${Date.now()}.jpg`,
        };

        setSelectedImage(newSelectedImage);
        setImageUrl(asset.uri);

        showAlert(
          "เลือกรูปภาพสำเร็จ",
          "กรุณากดปุ่ม 'แก้ไข' และ 'บันทึก' เพื่อเปลี่ยนรูปโปรไฟล์",
          "success"
        );
      }
    } catch (error) {
      showAlert("ข้อผิดพลาด", "ไม่สามารถเข้าถึงแกลเลอรี่ได้", "error");
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7, // ลดคุณภาพเล็กน้อย
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // ตรวจสอบขนาดไฟล์ (5MB)
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          showAlert("ไฟล์ใหญ่เกินไป", "กรุณาถ่ายรูปใหม่", "warning");
          return;
        }

        const newSelectedImage: SelectedImage = {
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          fileName: asset.fileName || `profile_${Date.now()}.jpg`,
        };

        setSelectedImage(newSelectedImage);
        setImageUrl(asset.uri);

        showAlert(
          "ถ่ายรูปสำเร็จ",
          "กรุณากดปุ่ม 'แก้ไข' และ 'บันทึก' เพื่อเปลี่ยนรูปโปรไฟล์",
          "success"
        );
      }
    } catch (error) {
      showAlert("ข้อผิดพลาด", "ไม่สามารถเข้าถึงกล้องได้", "error");
    }
  };

  const handleImagePress = async () => {
    const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
    const mediaLibraryPermission =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    showAlert("เปลี่ยนรูปโปรไฟล์", "เลือกวิธีการอัปโหลดรูปภาพ", "info", [
      {
        text: "กล้อง",
        onPress: takePhoto,
      },
      {
        text: "แกลเลอรี",
        onPress: pickImageFromLibrary,
      },
      { text: "ยกเลิก", style: "cancel" },
    ]);
  };

  const validateInput = () => {
    if (!username.trim()) {
      showAlert("ข้อผิดพลาด", "กรุณากรอกชื่อผู้ใช้", "warning");
      return false;
    }

    if (!email.trim()) {
      showAlert("ข้อผิดพลาด", "กรุณากรอกอีเมล", "warning");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("ข้อผิดพลาด", "รูปแบบอีเมลไม่ถูกต้อง", "warning");
      return false;
    }

    if (phone.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone.replace(/[-\s]/g, ""))) {
        showAlert("ข้อผิดพลาด", "รูปแบบเบอร์โทรไม่ถูกต้อง", "warning");
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) {
      return;
    }

    if (!user?.userId) {
      showAlert("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้", "error");
      return;
    }

    setIsSaving(true);

    try {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const updateData = {
        userId: user.userId,
        name: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        imageUrl: imageUrl,
        role: user.role || "User", // ใส่ default role
        image: selectedImage, // ส่ง selectedImage object ทั้งหมด
      };

      const response = await updateUser(updateData).unwrap();

      if (response.taskStatus) {
        const newImageUrl = response.data?.User?.imageUrl || imageUrl;

        dispatch(
          setCredentials({
            ...user,
            username: response.data?.User?.username || username.trim(),
            email: response.data?.User?.email || email.trim(),
            phone: response.data?.User?.phone || phone.trim(),
            imageUrl: newImageUrl,
            accessToken: response.data?.Token?.AccessToken || user.accessToken,
            refreshToken:
              response.data?.Token?.RefreshToken || user.refreshToken,
          })
        );

        setImageUrl(newImageUrl);
        setSelectedImage(null); // ล้าง selected image
        setIsEditing(false);

        showAlert("สำเร็จ", "อัปเดตข้อมูลเรียบร้อยแล้ว", "success");
      } else {
        showAlert(
          "ข้อผิดพลาด",
          response.message || "ไม่สามารถอัปเดตข้อมูลได้",
          "error"
        );
      }
    } catch (error: any) {
      let errorMessage = "เกิดข้อผิดพลาดในการอัปเดตข้อมูล";

      // ตรวจสอบประเภทของ error อย่างละเอียด
      if (
        error?.name === "TypeError" ||
        error?.message?.includes("fetch") ||
        error?.message?.includes("FETCH_ERROR") ||
        error?.message?.includes("Network")
      ) {
        errorMessage = "ปัญหาการเชื่อมต่อ กรุณาตรวจสอบอินเทอร์เน็ตและลองใหม่";
      } else if (error?.status) {
        switch (error.status) {
          case 413:
            errorMessage = "ไฟล์รูปใหญ่เกินไป กรุณาเลือกไฟล์ขนาดเล็กกว่า";
            break;
          case 415:
            errorMessage = "รูปแบบไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์รูปภาพ";
            break;
          case 400:
            errorMessage = "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลที่กรอก";
            break;
          case 409:
            errorMessage = "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว";
            break;
          case 500:
            errorMessage = "เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่ภายหลัง";
            break;
          default:
            errorMessage = `เกิดข้อผิดพลาด (รหัส: ${error.status})`;
        }
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        if (error.message.includes("multipart")) {
          errorMessage = "เกิดปัญหาในการส่งไฟล์รูปภาพ กรุณาลองเลือกรูปใหม่";
        } else if (error.message.includes("timeout")) {
          errorMessage = "การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่";
        } else {
          errorMessage = error.message;
        }
      }

      showAlert("ข้อผิดพลาด", errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUsername(user.username || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setImageUrl(user.imageUrl || null);
    setSelectedImage(null); // ล้าง selected image
    setIsEditing(false);
  };

  const floatTranslateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const getProfileImage = () => {
    // ถ้ามีรูปที่เลือกใหม่ ให้แสดงรูปนั้น
    if (selectedImage?.uri) {
      return { uri: selectedImage.uri };
    }

    // ถ้ามี imageUrl ให้แสดงรูปจาก server
    if (imageUrl) {
      const fullImageUrl = imageUrl.startsWith("http")
        ? imageUrl
        : `${BASE_URL}${imageUrl}`;
      return { uri: fullImageUrl };
    }

    // ถ้าไม่มีรูปใดๆ ให้ใช้รูป default
    return require("@/../assets/icon.png");
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Header options={{ title: "บัชชี" }} />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.heroSection}>
          <LinearGradient
            colors={gradients.tuscanHills.colors}
            start={gradients.tuscanHills.start}
            end={gradients.tuscanHills.end}
            style={styles.heroGradient}
          >
            <Animated.View
              style={[
                styles.decorativeCircle,
                styles.circle1,
                {
                  transform: [{ translateY: floatTranslateY }],
                  opacity: fadeAnim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.decorativeCircle,
                styles.circle2,
                {
                  transform: [
                    {
                      translateY: floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 5],
                      }),
                    },
                  ],
                  opacity: fadeAnim,
                },
              ]}
            />

            <Animated.View
              style={[
                styles.profileSection,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: profileScaleAnim },
                  ],
                },
              ]}
            >
              <TouchableOpacity onPress={handleImagePress} disabled={isSaving}>
                <Animated.View
                  style={[
                    styles.avatarContainer,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Surface style={styles.avatarSurface} elevation={5}>
                    <Avatar.Image
                      size={120}
                      source={getProfileImage()}
                      style={styles.avatar}
                    />
                    <Surface style={styles.cameraButtonSurface} elevation={4}>
                      <IconButton
                        icon="camera-plus"
                        size={20}
                        iconColor={colors.white}
                        style={styles.cameraButton}
                        onPress={handleImagePress}
                        disabled={isSaving}
                      />
                    </Surface>
                    {selectedImage && (
                      <Surface style={styles.newImageIndicator} elevation={3}>
                        <Text style={styles.newImageText}>ใหม่</Text>
                      </Surface>
                    )}
                  </Surface>
                </Animated.View>
              </TouchableOpacity>

              <Animated.View
                style={[
                  styles.welcomeTextContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <Text style={styles.welcomeText}>
                  ยินดีต้อนรับสู่ Primo Piazza
                </Text>
                <Text style={styles.nameText}>{username || "ผู้ใช้งาน"}</Text>
                <Chip
                  style={styles.memberChip}
                  textStyle={styles.memberChipText}
                  icon="crown"
                >
                  สมาชิกพิเศษ
                </Chip>
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </View>

        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <Card style={styles.formCard} elevation={5}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>ข้อมูลส่วนตัว</Text>
                <IconButton
                  icon={isEditing ? "pencil-off" : "pencil"}
                  size={20}
                  iconColor={colors.accentGold}
                  onPress={() => setIsEditing(!isEditing)}
                  style={styles.editButton}
                  disabled={isSaving}
                />
              </View>

              <Divider style={styles.divider} />

              <View style={styles.inputContainer}>
                <TextInput
                  label="ชื่อผู้ใช้"
                  value={username}
                  mode="outlined"
                  style={styles.input}
                  onChangeText={setUsername}
                  editable={isEditing && !isSaving}
                  left={<TextInput.Icon icon="account" />}
                  theme={{
                    colors: {
                      primary: colors.accentGold,
                      outline: colors.platinum,
                    },
                  }}
                />

                <TextInput
                  label="อีเมล์"
                  value={email}
                  mode="outlined"
                  style={styles.input}
                  onChangeText={setEmail}
                  editable={isEditing && !isSaving}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  left={<TextInput.Icon icon="email" />}
                  theme={{
                    colors: {
                      primary: colors.accentGold,
                      outline: colors.platinum,
                    },
                  }}
                />

                <TextInput
                  label="เบอร์โทร"
                  value={phone}
                  mode="outlined"
                  style={styles.input}
                  onChangeText={setPhone}
                  editable={isEditing && !isSaving}
                  keyboardType="phone-pad"
                  left={<TextInput.Icon icon="phone" />}
                  theme={{
                    colors: {
                      primary: colors.accentGold,
                      outline: colors.platinum,
                    },
                  }}
                />
              </View>

              {isEditing && (
                <Animated.View
                  style={[
                    styles.buttonContainer,
                    {
                      opacity: fadeAnim,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={styles.cancelButton}
                    labelStyle={styles.cancelButtonLabel}
                    disabled={isSaving}
                  >
                    ยกเลิก
                  </Button>

                  <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveButton}
                    icon="content-save"
                    labelStyle={styles.saveButtonLabel}
                    loading={isSaving}
                    disabled={isSaving}
                  >
                    {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                </Animated.View>
              )}
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View
          style={[
            styles.additionalSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card style={styles.infoCard} elevation={4}>
            <Card.Content>
              <Text style={styles.infoTitle}>สถิติการใช้งาน</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>15</Text>
                  <Text style={styles.statLabel}>ครั้งที่เข้าชม</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>8</Text>
                  <Text style={styles.statLabel}>กิจกรรมที่เข้าร่วม</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>2</Text>
                  <Text style={styles.statLabel}>รางวัลที่ได้รับ</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* เพิ่ม AlertModal */}
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        buttons={alertButtons}
        onDismiss={() => setAlertVisible(false)}
      />
    </>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  heroSection: {
    height: height * 0.4,
    position: "relative",
  },
  heroGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  decorativeCircle: {
    position: "absolute",
    backgroundColor: colors.white20,
    borderRadius: 100,
  },
  circle1: {
    width: 150,
    height: 150,
    top: 50,
    right: -50,
  },
  circle2: {
    width: 100,
    height: 100,
    bottom: 20,
    left: -30,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white10,
    transform: [{ skewX: "-20deg" }],
    width: 100,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatarSurface: {
    borderRadius: 70,
    backgroundColor: colors.white,
    padding: 10,
  },
  avatar: {
    backgroundColor: colors.backgroundAlt,
  },
  cameraButtonSurface: {
    position: "absolute",
    bottom: 5,
    right: 5,
    borderRadius: 20,
    backgroundColor: colors.accentGold,
  },
  cameraButton: {
    margin: 0,
    backgroundColor: colors.accentGold,
  },
  newImageIndicator: {
    position: "absolute",
    top: 5,
    left: 5,
    borderRadius: 15,
    backgroundColor: colors.success || "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newImageText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  welcomeTextContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 5,
    textAlign: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 15,
    textAlign: "center",
    textShadowColor: colors.black30,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  memberChip: {
    backgroundColor: colors.accentGold,
  },
  memberChipText: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: -30,
    paddingHorizontal: 20,
  },
  formCard: {
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  editButton: {
    backgroundColor: colors.accentGoldLight + "20",
  },
  divider: {
    backgroundColor: colors.platinum,
    marginBottom: 20,
  },
  inputContainer: {
    gap: 15,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.platinum,
  },
  cancelButtonLabel: {
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.accentGold,
  },
  saveButtonLabel: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },
  additionalSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoCard: {
    borderRadius: 15,
    backgroundColor: colors.white,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.accentGold,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.platinum,
    marginHorizontal: 10,
  },
  bottomSpacing: {
    height: 30,
  },
});
