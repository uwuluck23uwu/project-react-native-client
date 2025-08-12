import { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Card,
  Paragraph,
  Title,
  Text,
  Chip,
  Surface,
  Portal,
  Modal,
} from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Header, Icon } from "@/components";
import { RootStackParamList, colors, BASE_URL } from "@/utils";

const { width, height } = Dimensions.get("window");

const AnimalDetailsScreen = () => {
  const {
    params: { animal },
  } = useRoute<RouteProp<RootStackParamList, "รายละเอียด">>();

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const images = Array.isArray(animal.images)
    ? animal.images
    : (animal.images as any)?.$values ?? [];

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
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.9],
    extrapolate: "clamp",
  });

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Animated.View style={[styles.dynamicHeader, { opacity: headerOpacity }]}>
        <Header
          options={{
            title: animal.name || "รายละเอียด",
          }}
        />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[styles.heroSection, { transform: [{ scale: imageScale }] }]}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setActiveIndex(index);
            }}
          >
            {images.map((img: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => openImageModal(`${BASE_URL}${img.imageUrl}`)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: `${BASE_URL}${img.imageUrl}` }}
                  style={styles.heroImage}
                />
                <View style={styles.imageOverlay} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {images.map((_: any, index: number) => {
              const dotScale = scrollX.interpolate({
                inputRange: [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ],
                outputRange: [0.8, 1.2, 0.8],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.dot,
                    { transform: [{ scale: dotScale }] },
                    activeIndex === index ? styles.activeDot : {},
                  ]}
                />
              );
            })}
          </View>

          <Animated.View style={[styles.floatingTitle, { opacity: fadeAnim }]}>
            <Text style={styles.heroTitle}>{animal.name}</Text>
            <Text style={styles.heroSubtitle}>{animal.species}</Text>
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.quickInfoSection}>
            <Surface style={styles.quickInfoCard}>
              <View style={styles.quickInfoIcon}>
                <Icon
                  icon="calendar-outline"
                  type="Ionicons"
                  size={24}
                  color={colors.accentGold}
                />
              </View>
              <Text style={styles.quickInfoLabel}>วันเกิด</Text>
              <Text style={styles.quickInfoValue}>
                {animal.dateOfBirth
                  ? new Date(animal.dateOfBirth!).toLocaleDateString("th-TH")
                  : "-"}
              </Text>
            </Surface>

            <Surface style={styles.quickInfoCard}>
              <View style={styles.quickInfoIcon}>
                <Icon
                  icon="location"
                  type="Ionicons"
                  size={24}
                  color={colors.accentTerracotta}
                />
              </View>
              <Text style={styles.quickInfoLabel}>มาเมื่อ</Text>
              <Text style={styles.quickInfoValue}>
                {animal.dateOfBirth
                  ? new Date(animal.dateOfBirth!).toLocaleDateString("th-TH")
                  : "-"}
              </Text>
            </Surface>
          </View>

          <Card style={styles.scientificCard} elevation={3}>
            <Card.Title
              title="ข้อมูลทางวิทยาศาสตร์"
              titleStyle={styles.cardTitle}
              left={(props) => (
                <View style={styles.iconContainer}>
                  <Icon
                    icon="flask"
                    type="Ionicons"
                    size={24}
                    color={colors.accentGold}
                  />
                </View>
              )}
            />
            <Card.Content>
              <View style={styles.scientificInfo}>
                <Chip
                  icon="dna"
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {animal.scientificName}
                </Chip>
                <Paragraph style={styles.description}>
                  {animal.description}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.habitatCard} elevation={3}>
            <Card.Title
              title="ถิ่นที่อยู่อาศัย"
              titleStyle={styles.cardTitle}
              left={(props) => (
                <View style={styles.iconContainer}>
                  <Icon
                    icon="tree"
                    type="FontAwesome5"
                    size={20}
                    color={colors.accentGreen}
                  />
                </View>
              )}
            />
            <Card.Content>
              <View style={styles.habitatContent}>
                <Title style={styles.habitatName}>{animal.habitat?.name}</Title>
                <Paragraph style={styles.habitatDescription}>
                  {animal.habitat?.description}
                </Paragraph>

                <View style={styles.coordinatesContainer}>
                  <Icon
                    icon="location-on"
                    type="MaterialCommunityIcons"
                    size={16}
                    color={colors.accentGold}
                  />
                  <Text style={styles.coordinates}>
                    {animal.locationCoordinates}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => {}}
              style={styles.primaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon={() => (
                <Icon
                  icon="navigation"
                  type="MaterialCommunityIcons"
                  size={20}
                  color={colors.white}
                />
              )}
            >
              นำทาง
            </Button>

            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.secondaryButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.secondaryButtonLabel}
            >
              <Icon
                icon="favorite-border"
                type="MaterialIcons"
                size={20}
                color={colors.accentGold}
              />
              เพิ่มในรายการโปรด
            </Button>
          </View>
        </Animated.View>
      </ScrollView>

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowModal(false)}
          >
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  );
};

export default AnimalDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollView: {
    flex: 1,
  },
  dynamicHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
  },
  heroSection: {
    height: height * 0.5,
    position: "relative",
  },
  heroImage: {
    width: width,
    height: height * 0.5,
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.6)",
    margin: 4,
  },
  activeDot: {
    backgroundColor: colors.accentGold,
    width: 20,
  },
  floatingTitle: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.white,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    backgroundColor: colors.backgroundMain,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  quickInfoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  quickInfoCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: colors.backgroundAlt,
    elevation: 2,
  },
  quickInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundMain,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  scientificCard: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,215,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  scientificInfo: {
    gap: 12,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: colors.accentGold + "20",
  },
  chipText: {
    color: colors.accentGold,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  habitatCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
  },
  habitatContent: {
    gap: 8,
  },
  habitatName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accentGreen,
  },
  habitatDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  coordinates: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.accentGreen,
    borderRadius: 12,
    elevation: 3,
  },
  secondaryButton: {
    borderColor: colors.accentGold,
    borderRadius: 12,
    borderWidth: 2,
  },
  buttonContent: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accentGold,
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: width * 0.9,
    height: height * 0.7,
  },
});
