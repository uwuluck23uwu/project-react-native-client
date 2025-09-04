import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Text, Surface, Title, Paragraph, Button } from "react-native-paper";
import { setAnimals } from "@/reduxs/slices/animal.slice";
import { useGetAnimalsQuery } from "@/reduxs/apis/animal.api";
import { AppDispatch, RootState } from "@/reduxs/store";
import { searchWithFuse, colors } from "@/utils";
import { SearchItem, Loading, Search, Header, Chip } from "@/components";
import Icon from "@/components/Icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";

const { width, height } = Dimensions.get("window");

type IconType =
  | "FontAwesome"
  | "FontAwesome5"
  | "Feather"
  | "Fontisto"
  | "AntDesign"
  | "Ionicons"
  | "MaterialCommunityIcons";

interface Category {
  id: string;
  name: string;
  icon: string;
  type: IconType;
  gradient: readonly [string, string];
}

const SearchScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { currentLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const { data = [], isLoading } = useGetAnimalsQuery({ pageSize: 100 });
  const animals = useSelector((state: RootState) => state.animal.animals);

  const categories: Category[] = [
    {
      id: "all",
      name: "ทั้งหมด",
      icon: "apps",
      type: "MaterialCommunityIcons",
      gradient: ["#667eea", "#764ba2"] as const,
    },
    {
      id: "animal",
      name: "สัตว์",
      icon: "paw",
      type: "FontAwesome5",
      gradient: ["#f093fb", "#f5576c"] as const,
    },
    {
      id: "activity",
      name: "กิจกรรม",
      icon: "calendar",
      type: "FontAwesome5",
      gradient: ["#4facfe", "#00f2fe"] as const,
    },
    {
      id: "message",
      name: "ข่าวสาร",
      icon: "newspaper",
      type: "FontAwesome5",
      gradient: ["#43e97b", "#38f9d7"] as const,
    },
  ];

  useEffect(() => {
    if (data.length > 0) {
      dispatch(setAnimals(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSearch = useCallback(
    debounce((text: string) => {
      setDebouncedSearchText(text);
    }, 300),
    []
  );

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
    handleSearch(text);
  };

  const filteredAnimals = useMemo(() => {
    let filtered = animals;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((animal) => {
        const species = animal.species?.toLowerCase() || "";
        return species.includes(selectedCategory);
      });
    }

    if (debouncedSearchText) {
      filtered = searchWithFuse(filtered, debouncedSearchText, [
        "name",
        "species",
        "scientificName",
        "breed",
      ]);
    }

    return filtered;
  }, [animals, debouncedSearchText, selectedCategory]);

  const clearFilters = () => {
    setSearchText("");
    setDebouncedSearchText("");
    setSelectedCategory("all");
  };

  const EmptySearchState = () => (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <Surface style={styles.emptyCard} elevation={2}>
        <View style={styles.emptyIconContainer}>
          <Icon
            type="MaterialCommunityIcons"
            icon="magnify"
            size={64}
            color={colors.primary}
          />
        </View>
        {/* ✅ ข้อความว่าง */}
        <Title style={styles.emptyTitle}>{t("ไม่พบสัตว์ที่คุณค้นหา")}</Title>
        <Paragraph style={styles.emptyDescription}>
          {t("ลองค้นหาด้วยชื่อสัตว์_หรือสายพันธุ์")}
        </Paragraph>

        {(debouncedSearchText || selectedCategory !== "all") && (
          <Button
            mode="contained"
            icon="refresh"
            onPress={clearFilters}
            style={styles.clearFiltersButton}
            labelStyle={styles.clearFiltersText}
          >
            {t("ล้างการกรอง")}
          </Button>
        )}
      </Surface>
    </Animated.View>
  );

  const CategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        {/* ✅ หัวข้อหมวดหมู่ */}
        <Text style={styles.categoryTitle}>{t("หมวดหมู่")}</Text>
      </View>

      <Animated.View
        style={[
          styles.categoryContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((category, index) => (
            <Chip
              key={category.id}
              label={(t(category.name as any) as string) || category.name}
              icon={category.icon}
              type={category.type}
              selected={selectedCategory === category.id}
              gradient={category.gradient}
              onPress={() => setSelectedCategory(category.id)}
              appearDelay={index * 100}
              style={styles.chipStyle}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );

  const SearchResultsHeader = () => {
    const hasFilters = debouncedSearchText || selectedCategory !== "all";

    if (!hasFilters) return null;

    return (
      <Animated.View
        style={[
          styles.resultsHeaderContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <Surface style={styles.resultsCard} elevation={1}>
          <View style={styles.resultsContent}>
            <View style={styles.resultsInfo}>
              <View style={styles.resultsIconContainer}>
                <Icon
                  type="MaterialCommunityIcons"
                  icon="information-outline"
                  size={18}
                  color={colors.accentGold}
                />
              </View>
              <View style={styles.resultsTextContainer}>
                {/* ✅ “พบ … รายการ” */}
                <Text style={styles.resultsCount}>
                  {t("พบ")} {filteredAnimals.length} {t("รายการ")}
                </Text>
                {debouncedSearchText && (
                  <Text style={styles.resultsQuery}>
                    {t("สำหรับ")} "{debouncedSearchText}"
                  </Text>
                )}
              </View>
            </View>

            <Pressable onPress={clearFilters} style={styles.clearButton}>
              <Icon
                type="MaterialCommunityIcons"
                icon="close-circle"
                size={22}
                color={colors.accentTerracotta}
              />
            </Pressable>
          </View>
        </Surface>
      </Animated.View>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.gradientTuscan?.[0] || colors.primary}
      />

      {/* ✅ หัวข้อหน้า */}
      <Header options={{ title: t("ค้นหา") }} />

      {/* แก้ไข: เปลี่ยนจาก ScrollView เป็น View เพื่อแก้ปัญหา VirtualizedList */}
      <View style={styles.mainContainer}>
        {/* Search Input Section - ย้ายออกมานอก scroll */}
        <Animated.View
          style={[
            styles.searchSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            },
          ]}
        >
          <View style={styles.searchContainer}>
            <Search
              value={searchText}
              onChangeText={onChangeSearchText}
              placeholder={t("ค้นหาชื่อสัตว์_หรือ_สายพันธุ์")}
            />
          </View>
        </Animated.View>

        {/* Category Filter Section */}
        <CategoryFilter />

        {/* Results Header */}
        <SearchResultsHeader />

        {/* Search Results Section - ให้ SearchItem จัดการ scroll เอง */}
        <Animated.View
          style={[
            styles.resultsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
              flex: 1,
            },
          ]}
        >
          {filteredAnimals.length === 0 ? (
            <ScrollView contentContainerStyle={styles.emptyScrollContainer}>
              <EmptySearchState />
            </ScrollView>
          ) : (
            <View style={styles.resultsContainer}>
              <SearchItem
                data={filteredAnimals}
                isSearch={true}
                isSearchActive={
                  debouncedSearchText !== "" || selectedCategory !== "all"
                }
              />
            </View>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  searchSection: {
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: colors.backgroundMain,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  categoryContainer: {
    marginBottom: 20,
    backgroundColor: colors.backgroundMain,
  },
  categoryHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  categoryContent: {},
  categoryScroll: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  chipStyle: {
    marginRight: 12,
    marginVertical: 4,
  },
  resultsHeaderContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.backgroundMain,
  },
  resultsCard: {
    borderRadius: 12,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  resultsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  resultsInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resultsIconContainer: {
    marginRight: 10,
  },
  resultsTextContainer: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  resultsQuery: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  clearButton: {
    padding: 6,
    borderRadius: 20,
  },
  resultsSection: {
    flex: 1,
    minHeight: 400,
  },
  resultsContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyScrollContainer: {
    flex: 1,
  },
  emptyCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  clearFiltersButton: {
    borderRadius: 25,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.primary,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
