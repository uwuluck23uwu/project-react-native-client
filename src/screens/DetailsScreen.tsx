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
import { Animal } from "@/interfaces/animal.interface";
import { Event } from "@/interfaces/event.interface";
import { News } from "@/interfaces/news.interface";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

const { width, height } = Dimensions.get("window");

const DetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "รายละเอียด">>();

  const { animal, event, news } = route.params || {};
  const currentItem = animal || event || news;
  const itemType = animal ? "animal" : event ? "event" : news ? "news" : null;

  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  if (!currentItem || !itemType) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("ไม่พบข้อมูล")}</Text>
      </View>
    );
  }

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const images = Array.isArray(currentItem?.images)
    ? currentItem.images
    : (currentItem?.images as any)?.$values ?? [];

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

  const getTitle = () => {
    if (itemType === "animal")
      return String((currentItem as Animal).name || "");
    if (itemType === "event") return String((currentItem as Event).title || "");
    if (itemType === "news") return String((currentItem as News).title || "");
    return t("รายละเอียด");
  };

  const getSubtitle = () => {
    if (itemType === "animal")
      return String((currentItem as Animal).species || "");
    if (itemType === "event")
      return String((currentItem as Event).location || "");
    if (itemType === "news") return t("ข่าวสาร");
    return "";
  };

  const getDescription = () => {
    if (itemType === "animal")
      return String((currentItem as Animal).description || "");
    if (itemType === "event")
      return String((currentItem as Event).description || "");
    if (itemType === "news")
      return String((currentItem as News).contents || "");
    return "";
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("th-TH");
    } catch (error) {
      return "-";
    }
  };

  const renderAnimalSpecificContent = () => {
    if (itemType !== "animal") return null;
    const animalData = currentItem as Animal;

    return (
      <View>
        <View style={styles.quickInfoSection}>
          <Surface style={styles.quickInfoCard}>
            <View style={styles.quickInfoIcon}>
              <Icon
                icon="calendar-outline"
                type="Ionicons"
                size={24}
                color={colors.accentGold || "#FFD700"}
              />
            </View>
            <Text style={styles.quickInfoLabel}>{t("วันเกิด")}</Text>
            <Text style={styles.quickInfoValue}>
              {formatDate(animalData.dateOfBirth)}
            </Text>
          </Surface>

          <Surface style={styles.quickInfoCard}>
            <View style={styles.quickInfoIcon}>
              <Icon
                icon="location"
                type="Ionicons"
                size={24}
                color={colors.accentTerracotta || "#E07A5F"}
              />
            </View>
            <Text style={styles.quickInfoLabel}>{t("มาเมื่อ")}</Text>
            <Text style={styles.quickInfoValue}>
              {formatDate(animalData.arrivalDate)}
            </Text>
          </Surface>
        </View>

        <Card style={styles.scientificCard} elevation={3}>
          <Card.Title
            title={t("ข้อมูลทางวิทยาศาสตร์")}
            titleStyle={styles.cardTitle}
            left={() => (
              <View style={styles.iconContainer}>
                <Icon
                  icon="flask"
                  type="Ionicons"
                  size={24}
                  color={colors.accentGold || "#FFD700"}
                />
              </View>
            )}
          />
          <Card.Content>
            <View style={styles.scientificInfo}>
              <Chip icon="dna" style={styles.chip} textStyle={styles.chipText}>
                {String(
                  animalData.scientificName || t("ไม่ระบุชื่อวิทยาศาสตร์")
                )}
              </Chip>
              <Paragraph style={styles.description}>
                {String(animalData.description || t("ไม่มีคำอธิบาย"))}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.habitatCard} elevation={3}>
          <Card.Title
            title={t("ถิ่นที่อยู่อาศัย")}
            titleStyle={styles.cardTitle}
            left={() => (
              <View style={styles.iconContainer}>
                <Icon
                  icon="tree"
                  type="FontAwesome5"
                  size={20}
                  color={colors.accentGreen || "#4ECDC4"}
                />
              </View>
            )}
          />
          <Card.Content>
            <View style={styles.habitatContent}>
              <Title style={styles.habitatName}>
                {String(animalData.habitat?.name || t("ไม่ระบุถิ่นที่อยู่"))}
              </Title>
              <Paragraph style={styles.habitatDescription}>
                {String(animalData.habitat?.description || t("ไม่มีคำอธิบาย"))}
              </Paragraph>

              {animalData.locationCoordinates && (
                <View style={styles.coordinatesContainer}>
                  <Icon
                    icon="location-on"
                    type="MaterialCommunityIcons"
                    size={16}
                    color={colors.accentGold || "#FFD700"}
                  />
                  <Text style={styles.coordinates}>
                    {String(animalData.locationCoordinates)}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderEventSpecificContent = () => {
    if (itemType !== "event") return null;
    const eventData = currentItem as Event;

    return (
      <View>
        <View style={styles.quickInfoSection}>
          <Surface style={styles.quickInfoCard}>
            <View style={styles.quickInfoIcon}>
              <Icon
                icon="calendar-outline"
                type="Ionicons"
                size={24}
                color={colors.accentGold || "#FFD700"}
              />
            </View>
            <Text style={styles.quickInfoLabel}>{t("วันที่จัด")}</Text>
            <Text style={styles.quickInfoValue}>
              {formatDate(eventData.eventDate)}
            </Text>
          </Surface>

          <Surface style={styles.quickInfoCard}>
            <View style={styles.quickInfoIcon}>
              <Icon
                icon="clock-outline"
                type="Ionicons"
                size={24}
                color={colors.accentTerracotta || "#E07A5F"}
              />
            </View>
            <Text style={styles.quickInfoLabel}>{t("เวลา_กิจกรรม")}</Text>
            <Text style={styles.quickInfoValue}>
              {eventData.startTime && eventData.endTime
                ? `${String(eventData.startTime)} - ${String(
                    eventData.endTime
                  )}`
                : "-"}
            </Text>
          </Surface>
        </View>

        <Card style={styles.locationCard} elevation={3}>
          <Card.Title
            title={t("สถานที่_กิจกรรม")}
            titleStyle={styles.cardTitle}
            left={() => (
              <View style={styles.iconContainer}>
                <Icon
                  icon="location-on"
                  type="MaterialCommunityIcons"
                  size={24}
                  color={colors.accentGreen || "#4ECDC4"}
                />
              </View>
            )}
          />
          <Card.Content>
            <View style={styles.locationContent}>
              <Title style={styles.locationName}>
                {String(eventData.location || t("ไม่ระบุสถานที่"))}
              </Title>

              {eventData.locationCoordinates && (
                <View style={styles.coordinatesContainer}>
                  <Icon
                    icon="location-on"
                    type="MaterialCommunityIcons"
                    size={16}
                    color={colors.accentGold || "#FFD700"}
                  />
                  <Text style={styles.coordinates}>
                    {String(eventData.locationCoordinates)}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderNewsSpecificContent = () => {
    if (itemType !== "news") return null;
    const newsData = currentItem as News;

    return (
      <View>
        <View style={styles.quickInfoSection}>
          <Surface style={styles.quickInfoCard}>
            <View style={styles.quickInfoIcon}>
              <Icon
                icon="calendar-outline"
                type="Ionicons"
                size={24}
                color={colors.accentGold || "#FFD700"}
              />
            </View>
            <Text style={styles.quickInfoLabel}>{t("วันที่เผยแพร่")}</Text>
            <Text style={styles.quickInfoValue}>
              {formatDate(newsData.publishedDate)}
            </Text>
          </Surface>

          <Surface style={styles.quickInfoCard}>
            <View style={styles.quickInfoIcon}>
              <Icon
                icon="newspaper-outline"
                type="Ionicons"
                size={24}
                color={colors.accentTerracotta || "#E07A5F"}
              />
            </View>
            <Text style={styles.quickInfoLabel}>{t("ประเภท")}</Text>
            <Text style={styles.quickInfoValue}>{t("ข่าวสาร")}</Text>
          </Surface>
        </View>
      </View>
    );
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
            title: getTitle() || t("รายละเอียด"),
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
          {images.length > 0 ? (
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
          ) : (
            <View style={styles.noImageContainer}>
              <View style={styles.imageOverlay} />
              <Text style={styles.noImageText}>{t("ไม่มีรูปภาพ")}</Text>
            </View>
          )}

          {images.length > 1 && (
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
          )}

          <Animated.View style={[styles.floatingTitle, { opacity: fadeAnim }]}>
            <Text style={styles.heroTitle}>{getTitle() || "ไม่ระบุชื่อ"}</Text>
            <Text style={styles.heroSubtitle}>{getSubtitle()}</Text>
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
          {renderAnimalSpecificContent()}
          {renderEventSpecificContent()}
          {renderNewsSpecificContent()}

          {(itemType === "event" || itemType === "news") && (
            <Card style={styles.descriptionCard} elevation={3}>
              <Card.Title
                title={
                  itemType === "event"
                    ? t("รายละเอียดกิจกรรม")
                    : t("เนื้อหาข่าว")
                }
                titleStyle={styles.cardTitle}
                left={() => (
                  <View style={styles.iconContainer}>
                    <Icon
                      icon={itemType === "event" ? "calendar" : "newspaper"}
                      type="Ionicons"
                      size={24}
                      color={colors.accentGold || "#FFD700"}
                    />
                  </View>
                )}
              />
              <Card.Content>
                <Paragraph style={styles.description}>
                  {getDescription() || t("ไม่มีคำอธิบาย")}
                </Paragraph>
              </Card.Content>
            </Card>
          )}

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
                  color={colors.white || "#FFFFFF"}
                />
              )}
            >
              {t("นำทาง")}
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
                color={colors.accentGold || "#FFD700"}
              />
              {t("เพิ่มในรายการโปรด")}
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

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain || "#FFFFFF",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundMain || "#FFFFFF",
  },
  errorText: {
    fontSize: 18,
    color: colors.textPrimary || "#000000",
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
  noImageContainer: {
    width: width,
    height: height * 0.5,
    backgroundColor: colors.backgroundAlt || "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 18,
    color: colors.textSecondary || "#666666",
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
    backgroundColor: colors.accentGold || "#FFD700",
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
    color: colors.white || "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.white || "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    backgroundColor: colors.backgroundMain || "#FFFFFF",
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
    backgroundColor: colors.backgroundAlt || "#F5F5F5",
    elevation: 2,
  },
  quickInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundMain || "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: colors.textSecondary || "#666666",
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary || "#000000",
  },
  scientificCard: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt || "#F5F5F5",
  },
  locationCard: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt || "#F5F5F5",
  },
  descriptionCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt || "#F5F5F5",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary || "#000000",
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
  locationContent: {
    gap: 8,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accentGreen || "#4ECDC4",
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: (colors.accentGold || "#FFD700") + "20",
  },
  chipText: {
    color: colors.accentGold || "#FFD700",
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary || "#000000",
  },
  habitatCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt || "#F5F5F5",
  },
  habitatContent: {
    gap: 8,
  },
  habitatName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accentGreen || "#4ECDC4",
  },
  habitatDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary || "#666666",
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  coordinates: {
    fontSize: 12,
    color: colors.textSecondary || "#666666",
  },
  actionButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.accentGreen || "#4ECDC4",
    borderRadius: 12,
    elevation: 3,
  },
  secondaryButton: {
    borderColor: colors.accentGold || "#FFD700",
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
    color: colors.white || "#FFFFFF",
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accentGold || "#FFD700",
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
