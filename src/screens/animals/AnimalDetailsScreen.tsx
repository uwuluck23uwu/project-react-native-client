import { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Button,
  Divider,
} from "react-native-paper";
import LottieView from "lottie-react-native";
import { Header, Icon } from "@/components";
import { colors, myNavigation, IMAGE_URL } from "@/utils";

const { width } = Dimensions.get("window");

const AnimalDetailsScreen = ({ route }: any) => {
  const { animal } = route.params;
  const { navigate } = myNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const calculateAge = (dob?: string) => {
    if (!dob) return "ไม่ทราบ";
    const birthDate = new Date(dob);
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
      <Header options={{ title: animal.name }} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* <LottieView
          source={require("@/assets/lottie/animal.json")}
          autoPlay
          loop
          style={{ height: 150, marginBottom: 10 }}
        /> */}

        <Card style={styles.imageCard}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {animal.images?.$values.map((img: any, index: number) => (
              <Image
                key={index}
                source={{ uri: `${IMAGE_URL}${img.imageUrl}` }}
                style={styles.image}
              />
            ))}
          </ScrollView>
        </Card>

        {/* 🧾 ข้อมูลสัตว์พร้อม Animation */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY }],
          }}
        >
          <Title style={styles.title}>{animal.name}</Title>
          <Paragraph style={styles.textCenter}>
            ชื่อวิทยาศาสตร์: {animal.scientificName}
          </Paragraph>
          <Paragraph style={styles.textCenter}>
            สายพันธุ์: {animal.species}
          </Paragraph>
          <Paragraph style={styles.textCenter}>
            อายุ: {calculateAge(animal.dateOfBirth)} ขวบ
          </Paragraph>

          <View style={styles.chipContainer}>
            <Chip icon="alert-circle-outline" style={styles.chip}>
              สถานะ: {animal.status}
            </Chip>
          </View>

          <Card style={styles.detailCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>รายละเอียด</Title>
              <Paragraph>{animal.description}</Paragraph>
              <Divider style={{ marginVertical: 10 }} />

              <View style={styles.infoRow}>
                <Icon
                  icon="map-marker"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={colors.primary}
                />
                <Paragraph style={styles.infoText}>
                  ถิ่นที่อยู่: {animal.habitat?.name || "ไม่ทราบ"}
                </Paragraph>
              </View>

              <View style={styles.infoRow}>
                <Icon
                  icon="map-outline"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={colors.primary}
                />
                <Paragraph style={styles.infoText}>
                  พิกัด: {animal.locationCoordinates || "ไม่ทราบ"}
                </Paragraph>
              </View>

              <View style={styles.infoRow}>
                <Icon
                  icon="calendar"
                  type="FontAwesome"
                  size={20}
                  color={colors.primary}
                />
                <Paragraph style={styles.infoText}>
                  วันเกิด: {animal.dateOfBirth || "ไม่ทราบ"}
                </Paragraph>
              </View>

              <View style={styles.infoRow}>
                <Icon
                  icon="calendar-check"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={colors.primary}
                />
                <Paragraph style={styles.infoText}>
                  มาถึง: {animal.arrivalDate || "ไม่ทราบ"}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            onPress={() => navigate("ชำระเงิน", { animalId: animal.animalId })}
            icon={() => (
              <Icon
                icon="hand-holding-heart"
                type="FontAwesome5"
                size={18}
                color={colors.white}
              />
            )}
            style={[styles.button, { backgroundColor: colors.accentGreen }]}
          >
            บริจาค
          </Button>

          <Button
            mode="outlined"
            onPress={() => {}}
            icon={() => (
              <Icon
                icon="share-variant"
                type="MaterialCommunityIcons"
                size={20}
                color={colors.primary}
              />
            )}
            style={styles.button}
          >
            แชร์
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnimalDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  imageCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    width,
    height: 250,
    resizeMode: "cover",
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 6,
    color: colors.primary,
  },
  textCenter: {
    textAlign: "center",
    color: colors.textSecondary,
  },
  chipContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  chip: {
    backgroundColor: colors.secondary,
  },
  detailCard: {
    backgroundColor: colors.backgroundAlt,
    marginVertical: 16,
    padding: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.textPrimary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  button: {
    flex: 0.45,
  },
});
