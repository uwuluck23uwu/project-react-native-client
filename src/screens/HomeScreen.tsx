import { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { Title, Paragraph, Surface, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import { News } from "@/interfaces/news.interface";
import { Event } from "@/interfaces/event.interface";
import { Animal } from "@/interfaces/animal.interface";
import { setNews } from "@/reduxs/slices/news.slice";
import { setEvents } from "@/reduxs/slices/event.slice";
import { setAnimals } from "@/reduxs/slices/animal.slice";
import { startRealtime } from "@/realtime";
import { useGetNewsQuery } from "@/reduxs/apis/news.api";
import { useGetEventsQuery } from "@/reduxs/apis/event.api";
import { useGetAnimalsQuery } from "@/reduxs/apis/animal.api";
import { AppDispatch, RootState } from "@/reduxs/store";
import { myNavigation, BASE_URL } from "@/utils";
import { LongCard, ShortCard, Loading, Search, Chip } from "@/components";
import colors, { gradients } from "@/utils/colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = myNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  const { data: animalsData, isLoading: animalsLoading } = useGetAnimalsQuery(
    {}
  );
  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery({});
  const { data: newsData, isLoading: newsLoading } = useGetNewsQuery({});

  const animals = useSelector((state: RootState) => state.animal.animals);
  const events = useSelector((state: RootState) => state.event.events);
  const news = useSelector((state: RootState) => state.news.news);

  const categories = [
    {
      id: "all",
      name: "ทั้งหมด",
      icon: "apps",
      type: "MaterialCommunityIcons" as const,
      gradient: ["#667eea", "#764ba2"] as const,
    },
    {
      id: "animal",
      name: "สัตว์",
      icon: "paw",
      type: "FontAwesome5" as const,
      gradient: ["#f093fb", "#f5576c"] as const,
    },
    {
      id: "activity",
      name: "กิจกรรม",
      icon: "calendar",
      type: "FontAwesome5" as const,
      gradient: ["#4facfe", "#00f2fe"] as const,
    },
    {
      id: "message",
      name: "ข่าวสาร",
      icon: "newspaper",
      type: "FontAwesome5" as const,
      gradient: ["#43e97b", "#38f9d7"] as const,
    },
  ] as const;

  useEffect(() => {
    const stop = startRealtime();
    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    const createFloatingAnimation = (
      animValue: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10,
            duration: 2000 + delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 10,
            duration: 2000 + delay,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatingAnimation(float1, 0).start();
    createFloatingAnimation(float2, 500).start();
    createFloatingAnimation(float3, 1000).start();

    Animated.loop(
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
    ).start();
  }, []);

  useEffect(() => {
    if (animals.length > 0 || events.length > 0 || news.length > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideUpAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animals, events, news]);

  useEffect(() => {
    const cleanAnimals = (animalsData?.data?.$values ?? []).map(
      (a: any, index: number) => {
        const imagePath = a.images?.$values?.[0]?.imageUrl;

        const safeAnimal: Animal & {
          type: string;
          image?: string | null;
          rating?: number;
        } = {
          animalId: String(a.animalId || ""),
          habitatId: String(a.habitatId || ""),
          name: String(a.name || ""),
          species: String(a.species || ""),
          scientificName: String(a.scientificName || ""),
          description: String(a.description || ""),
          locationCoordinates: String(a.locationCoordinates || ""),
          status: String(a.status || ""),
          dateOfBirth: a.dateOfBirth ? String(a.dateOfBirth) : undefined,
          arrivalDate: a.arrivalDate ? String(a.arrivalDate) : undefined,
          createdAt: a.createdAt ? String(a.createdAt) : undefined,
          updatedAt: a.updatedAt ? String(a.updatedAt) : undefined,
          habitat: a.habitat || undefined,
          images: a.images || undefined,
          image: imagePath ? `${BASE_URL}${imagePath}` : null,
          type: "animal",
          rating: a.rating ? Number(a.rating) : 0,
        };

        return safeAnimal;
      }
    );

    if (cleanAnimals.length) dispatch(setAnimals(cleanAnimals));
  }, [animalsData]);

  useEffect(() => {
    const cleanEvents = (eventsData?.data?.$values ?? []).map(
      (e: any, index: number) => {
        const imagePath = e.images?.$values?.[0]?.imageUrl;

        const safeEvent: Event & {
          type: string;
          image?: string | null;
          rating?: number;
        } = {
          eventId: String(e.eventId || ""),
          title: String(e.title || ""),
          description: String(e.description || ""),
          location: String(e.location || ""),
          locationCoordinates: String(e.locationCoordinates || ""),
          status: String(e.status || ""),
          eventDate: e.eventDate ? String(e.eventDate) : undefined,
          startTime: e.startTime ? String(e.startTime) : undefined,
          endTime: e.endTime ? String(e.endTime) : undefined,
          createdAt: e.createdAt ? String(e.createdAt) : undefined,
          updatedAt: e.updatedAt ? String(e.updatedAt) : undefined,
          images: e.images || undefined,
          image: imagePath ? `${BASE_URL}${imagePath}` : null,
          type: "event",
          rating: e.rating ? Number(e.rating) : 0,
        };

        return safeEvent;
      }
    );

    if (cleanEvents.length) dispatch(setEvents(cleanEvents));
  }, [eventsData]);

  useEffect(() => {
    const cleanNews = (newsData?.data?.$values ?? []).map(
      (n: any, index: number) => {
        const imagePath = n.images?.$values?.[0]?.imageUrl;

        const safeNews: News & {
          type: string;
          image?: string | null;
          rating?: number;
        } = {
          newsId: String(n.newsId || ""),
          title: String(n.title || ""),
          contents: String(n.contents || ""),
          publishedDate: n.publishedDate ? String(n.publishedDate) : undefined,
          createdAt: n.createdAt ? String(n.createdAt) : undefined,
          updatedAt: n.updatedAt ? String(n.updatedAt) : undefined,
          images: n.images || undefined,
          image: imagePath ? `${BASE_URL}${imagePath}` : null,
          type: "news",
          rating: n.rating ? Number(n.rating) : 0,
        };

        return safeNews;
      }
    );

    if (cleanNews.length) dispatch(setNews(cleanNews));
  }, [newsData]);

  const getAllContent = () => {
    let allContent = [];
    if (selectedCategory === "ทั้งหมด" || selectedCategory === "สัตว์") {
      allContent.push(...animals.map((item) => ({ ...item, type: "animal" })));
    }
    if (selectedCategory === "ทั้งหมด" || selectedCategory === "กิจกรรม") {
      allContent.push(...events.map((item) => ({ ...item, type: "event" })));
    }
    if (selectedCategory === "ทั้งหมด" || selectedCategory === "ข่าวสาร") {
      allContent.push(...news.map((item) => ({ ...item, type: "news" })));
    }

    if (search) {
      allContent = allContent.filter((item) => {
        const searchLower = search.toLowerCase();
        if (item.type === "animal") {
          const animalItem = item as Animal & { type: string };
          return (
            animalItem.name?.toLowerCase().includes(searchLower) ||
            animalItem.species?.toLowerCase().includes(searchLower)
          );
        } else if (item.type === "event") {
          const eventItem = item as Event & { type: string };
          return (
            eventItem.title?.toLowerCase().includes(searchLower) ||
            eventItem.description?.toLowerCase().includes(searchLower)
          );
        } else if (item.type === "news") {
          const newsItem = item as News & { type: string };
          return (
            newsItem.title?.toLowerCase().includes(searchLower) ||
            newsItem.contents?.toLowerCase().includes(searchLower)
          );
        }
        return false;
      });
    }

    return allContent;
  };

  const allContent = getAllContent();
  const topContent = allContent.slice(0, 5);
  const restContent = allContent.slice(5);

  const stats = {
    animals: animals.length,
    events: events.length,
    news: news.length,
    total: animals.length + events.length + news.length,
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const backgroundScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 1.2],
    extrapolate: "clamp",
  });

  const handleItemPress = (item: any) => {
    const params = {} as any;

    if (item.type === "animal") {
      params.animal = item;
    } else if (item.type === "event") {
      params.event = item;
    } else if (item.type === "news") {
      params.news = item;
    }

    navigate("รายละเอียด", params);
  };

  const renderContentItem = ({ item }: { item: any }) => {
    return (
      <Animated.View
        style={[
          styles.featuredItem,
          {
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <LongCard
          data={item}
          width={320}
          height={220}
          onPress={() => handleItemPress(item)}
        />
      </Animated.View>
    );
  };

  const renderGridItem = ({ item }: { item: any }) => {
    return (
      <Animated.View
        style={[
          styles.gridItem,
          {
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <ShortCard data={item} onPress={() => handleItemPress(item)} />
      </Animated.View>
    );
  };

  if (animalsLoading || eventsLoading || newsLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Animated.View
        style={[
          styles.backgroundContainer,
          { transform: [{ scale: backgroundScale }] },
        ]}
      >
        <LinearGradient
          colors={gradients.italianSunset.colors}
          start={gradients.italianSunset.start}
          end={gradients.italianSunset.end}
          style={styles.gradient}
        />
        <Animated.View
          style={[
            styles.floatingElement,
            styles.floatingElement1,
            {
              backgroundColor: colors.white10,
              transform: [{ translateY: float1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingElement,
            styles.floatingElement2,
            {
              backgroundColor: colors.white10,
              transform: [{ translateY: float2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingElement,
            styles.floatingElement3,
            {
              backgroundColor: colors.white10,
              transform: [{ translateY: float3 }],
            },
          ]}
        />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.heroContainer,
            {
              opacity: headerOpacity,
              transform: [
                { translateY: headerTranslateY },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <BlurView intensity={40} tint="light" style={styles.heroGlass}>
            <LottieView
              source={require("@/../assets/animations/animal.json")}
              autoPlay
              loop
              style={styles.heroAnimation}
            />
            <Title style={styles.heroTitle}>🌟 Primo Piazza 🌟</Title>
            <Title style={styles.heroSubtitle}>
              {t("ยินดีต้อนรับสู่เมืองอิตาเลียกลางเขาใหญ่")}
            </Title>
            <Paragraph style={styles.heroText}>
              {t("เพลิดเพลินกับอัลปาก้า")}
            </Paragraph>

            <View style={styles.statsContainer}>
              <Animated.View
                style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}
              >
                <Title style={styles.statNumber}>{stats.animals}</Title>
                <Paragraph style={styles.statLabel}>{t("สัตว์")}</Paragraph>
              </Animated.View>
              <Animated.View
                style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}
              >
                <Title style={styles.statNumber}>{stats.events}</Title>
                <Paragraph style={styles.statLabel}>{t("กิจกรรม")}</Paragraph>
              </Animated.View>
              <Animated.View
                style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}
              >
                <Title style={styles.statNumber}>{stats.news}</Title>
                <Paragraph style={styles.statLabel}>{t("ข่าวสาร")}</Paragraph>
              </Animated.View>
            </View>
          </BlurView>
        </Animated.View>

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.searchContainer}>
            <Search
              value=""
              onChangeText={() => {}}
              editable={false}
              placeholder={t("ค้นหา")}
              onIconPress={() => navigate("ค้นหา")}
            />
          </View>

          <View style={styles.categorySection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
              contentContainerStyle={styles.chipScrollContent}
            >
              {categories.map((cat, i) => (
                <Chip
                  key={cat.name}
                  label={t(cat.name as any) as string}
                  icon={cat.icon}
                  type={cat.type}
                  selected={selectedCategory === cat.name}
                  gradient={cat.gradient}
                  onPress={() => setSelectedCategory(cat.name)}
                  appearDelay={i * 80}
                  style={styles.chipContainer}
                />
              ))}
            </ScrollView>
          </View>

          {topContent.length > 0 && (
            <View style={styles.featuredSection}>
              <View style={styles.sectionHeader}>
                <Title style={styles.sectionTitle}>{t("เนื้อหาแนะนำ")}</Title>
                <Paragraph style={styles.sectionSubtitle}>
                  {t("เนื้อหายอดนิยมที่นักท่องเที่ยวชื่นชอบ")}
                </Paragraph>
              </View>

              <Animated.FlatList
                data={topContent}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => {
                  if (item.type === "animal") {
                    return `animal-${
                      (item as Animal & { type: string }).animalId
                    }`;
                  } else if (item.type === "event") {
                    return `event-${
                      (item as Event & { type: string }).eventId
                    }`;
                  } else if (item.type === "news") {
                    return `news-${(item as News & { type: string }).newsId}`;
                  }
                  return `${item.type}-unknown`;
                }}
                contentContainerStyle={styles.featuredList}
                renderItem={renderContentItem}
              />
            </View>
          )}

          <View style={styles.allContentSection}>
            <View style={styles.sectionHeader}>
              <Title style={styles.sectionTitle}>
                🔍{" "}
                {selectedCategory === "ทั้งหมด"
                  ? t("เนื้อหาทั้งหมด")
                  : (t(selectedCategory as any) as string)}{" "}
                ({restContent.length})
              </Title>
              <Paragraph style={styles.sectionSubtitle}>
                {selectedCategory === "ทั้งหมด"
                  ? t("สำรวจเนื้อหาน่าสนใจทุกประเภท")
                  : `${t("เนื้อหาทั้งหมดในหมวด")} ${t(
                      selectedCategory as any
                    )}`}
              </Paragraph>
            </View>

            {restContent.length > 0 ? (
              <FlatList
                data={restContent}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                scrollEnabled={false}
                keyExtractor={(item) => {
                  if (item.type === "animal") {
                    return `animal-${
                      (item as Animal & { type: string }).animalId
                    }`;
                  } else if (item.type === "event") {
                    return `event-${
                      (item as Event & { type: string }).eventId
                    }`;
                  } else if (item.type === "news") {
                    return `news-${(item as News & { type: string }).newsId}`;
                  }
                  return `${item.type}-unknown`;
                }}
                renderItem={renderGridItem}
              />
            ) : (
              <Surface style={styles.emptyState} elevation={4}>
                <LinearGradient
                  colors={gradients.italianSunset.colors}
                  start={gradients.italianSunset.start}
                  end={gradients.italianSunset.end}
                  style={styles.emptyGradient}
                >
                  <LottieView
                    source={require("@/../assets/animations/404.json")}
                    autoPlay
                    loop
                    style={styles.emptyAnimation}
                  />
                  <Title style={styles.emptyTitle}>
                    {t("ไม่พบเนื้อหาที่ค้นหา")}
                  </Title>
                  <Paragraph style={styles.emptyText}>
                    {t("ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดูนะครับ")}
                  </Paragraph>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setSearch("");
                      setSelectedCategory("ทั้งหมด");
                    }}
                    style={styles.resetButton}
                    buttonColor={colors.accentGold}
                    textColor={colors.textPrimary}
                  >
                    {t("รีเซ็ตการค้นหา")}
                  </Button>
                </LinearGradient>
              </Surface>
            )}
          </View>

          <View style={styles.bottomSpacing} />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.6,
  },
  gradient: {
    flex: 1,
  },
  floatingElement: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white10,
  },
  floatingElement1: {
    top: "10%",
    left: "10%",
    width: 80,
    height: 80,
  },
  floatingElement2: {
    top: "30%",
    right: "15%",
    width: 60,
    height: 60,
  },
  floatingElement3: {
    top: "50%",
    left: "70%",
    width: 40,
    height: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  heroContainer: {
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  heroGlass: {
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    overflow: "hidden",
  },
  heroAnimation: {
    height: 150,
    width: 150,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 5,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
    opacity: 0.9,
  },
  heroText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  contentContainer: {
    backgroundColor: colors.backgroundMain,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    minHeight: screenHeight * 0.7,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  categorySection: {
    marginBottom: 30,
  },
  chipScroll: {
    paddingLeft: 20,
  },
  chipScrollContent: {
    paddingRight: 20,
  },
  chipContainer: {
    marginRight: 15,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "400",
  },
  featuredSection: {
    marginBottom: 30,
  },
  featuredList: {
    paddingLeft: 20,
  },
  featuredItem: {
    marginRight: 15,
  },
  allContentSection: {
    paddingHorizontal: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  emptyState: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
  },
  emptyGradient: {
    padding: 30,
    alignItems: "center",
  },
  emptyAnimation: {
    height: 120,
    width: 120,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.white80,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  resetButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 50,
  },
});
