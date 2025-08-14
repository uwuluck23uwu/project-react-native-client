import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";
import { Text, Surface } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/utils";
import { useGetLocationsQuery } from "@/reduxs/apis/location.api";
import { Header, Icon, Loading, Pin } from "@/components";
import type { Location } from "@/interfaces/location.interface";
import MapModal, { Marker } from "@/components/modal/MapModal";

function parseNum(n?: string) {
  const v = parseFloat(String(n ?? "").replace(",", "."));
  return Number.isFinite(v) ? v : NaN;
}
function splitCsv(csv?: string) {
  return (csv ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function pickIconAndColor(acts: string[]) {
  const a = new Set(acts);
  if (a.has("สัตว์"))
    return {
      icon: "sheep",
      iconType: "MaterialCommunityIcons" as const,
      color: colors.vineGreen,
    };
  if (a.has("รับประทานอาหาร/เครื่องดื่ม"))
    return {
      icon: "coffee",
      iconType: "MaterialCommunityIcons" as const,
      color: colors.secondary,
    };
  if (a.has("เรียนรู้"))
    return {
      icon: "book-open-variant",
      iconType: "MaterialCommunityIcons" as const,
      color: colors.info,
    };
  if (a.has("ถ่ายรูป"))
    return {
      icon: "camera",
      iconType: "MaterialCommunityIcons" as const,
      color: colors.accentTerracotta,
    };
  if (a.has("เดินชม"))
    return {
      icon: "walk",
      iconType: "MaterialCommunityIcons" as const,
      color: colors.tuscanSky,
    };
  if (a.has("ซื้อของที่ระลึก"))
    return {
      icon: "shopping",
      iconType: "MaterialCommunityIcons" as const,
      color: colors.sunflowerYellow,
    };
  if (a.has("พักผ่อน"))
    return {
      icon: "sofa",
      iconType: "MaterialCommunityIcons" as const,
      color: colors.lavenderPurple,
    };
  return {
    icon: "map-marker",
    iconType: "MaterialCommunityIcons" as const,
    color: colors.textMuted,
  };
}

const MapScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState<Marker | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  const filterBarAnim = useRef(new Animated.Value(100)).current;

  const { data, isLoading } = useGetLocationsQuery({
    pageSize: 100,
    currentPage: 1,
    search: "",
  });

  useEffect(() => {
    Animated.spring(filterBarAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  const markers: Marker[] = useMemo(() => {
    const raw = (data as any)?.data?.$values as Location[] | undefined;
    if (!raw?.length) return [];
    return raw
      .map((loc) => {
        const x = parseNum(loc.x);
        const y = parseNum(loc.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
        const acts = splitCsv(loc.activities);
        const { icon, color, iconType } = pickIconAndColor(acts);
        return {
          id: loc.locationId,
          name: loc.name,
          x,
          y,
          description: loc.description ?? "",
          activities: acts,
          color,
          icon,
          iconType,
        } as Marker;
      })
      .filter(Boolean) as Marker[];
  }, [data]);

  const filters = useMemo(() => {
    const s = new Set<string>();
    markers.forEach((m) => m.activities.forEach((a: any) => s.add(a)));
    const list = Array.from(s);
    return [
      {
        key: "all",
        label: "ทั้งหมด",
        icon: "map-marker",
        color: colors.primary,
      },
    ].concat(
      list.map((label) => ({
        key: label,
        label,
        icon:
          label === "สัตว์"
            ? "sheep"
            : label === "รับประทานอาหาร/เครื่องดื่ม"
            ? "coffee"
            : label === "เรียนรู้"
            ? "book-open-variant"
            : label === "ถ่ายรูป"
            ? "camera"
            : label === "เดินชม"
            ? "walk"
            : label === "ซื้อของที่ระลึก"
            ? "shopping"
            : label === "พักผ่อน"
            ? "sofa"
            : "tag",
        color:
          label === "สัตว์"
            ? colors.vineGreen
            : label === "รับประทานอาหาร/เครื่องดื่ม"
            ? colors.secondary
            : label === "เรียนรู้"
            ? colors.info
            : label === "ถ่ายรูป"
            ? colors.accentTerracotta
            : label === "เดินชม"
            ? colors.tuscanSky
            : label === "ซื้อของที่ระลึก"
            ? colors.sunflowerYellow
            : label === "พักผ่อน"
            ? colors.lavenderPurple
            : colors.textMuted,
      }))
    );
  }, [markers]);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? markers
        : markers.filter((m) => m.activities.includes(activeFilter)),
    [markers, activeFilter]
  );

  const handleLocationPress = (m: Marker) => {
    setSelectedLocation(m);
    setShowModal(true);
  };
  const handleFilterChange = (k: string) => setActiveFilter(k);

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <Header options={{ title: "แผนที่" }} />

      <View style={styles.mapContainer}>
        <ImageBackground
          source={require("@/../assets/map.png")}
          style={styles.mapFull}
          imageStyle={styles.mapImage}
          resizeMode="cover"
          onLayout={(e) =>
            setMapSize({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            })
          }
        >
          {mapSize.width > 0 &&
            filtered.map((marker, index) => (
              <Pin
                key={marker.id}
                marker={marker}
                onPress={() => handleLocationPress(marker)}
                index={index}
                mapWidth={mapSize.width}
                mapHeight={mapSize.height}
              />
            ))}
        </ImageBackground>
      </View>

      <Animated.View
        style={[
          styles.modernFilterBar,
          { transform: [{ translateY: filterBarAnim }] },
        ]}
      >
        <LinearGradient
          colors={[colors.white, colors.cream]}
          style={styles.filterGradient}
        >
          <ScrollView
            horizontal
            style={styles.filterScrollView}
            contentContainerStyle={styles.filterScrollContent}
            showsHorizontalScrollIndicator={false}
          >
            {filters.map((f) => {
              const selected = activeFilter === f.key;
              return (
                <Surface
                  key={f.key}
                  style={[
                    styles.modernFilterChip,
                    selected && { backgroundColor: f.color },
                  ]}
                  elevation={selected ? 5 : 3}
                >
                  <TouchableOpacity
                    onPress={() => handleFilterChange(f.key)}
                    style={styles.filterChipContent}
                  >
                    <Icon
                      icon={f.icon}
                      type="MaterialCommunityIcons"
                      size={18}
                      color={selected ? colors.white : f.color}
                    />
                    <Text
                      style={[
                        styles.modernFilterText,
                        { color: selected ? colors.white : colors.textPrimary },
                        selected && styles.activeModernFilterText,
                      ]}
                    >
                      {f.label}
                    </Text>
                    {selected && (
                      <View
                        style={[
                          styles.selectedIndicator,
                          { backgroundColor: colors.white },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                </Surface>
              );
            })}
          </ScrollView>
        </LinearGradient>
      </Animated.View>

      <MapModal
        visible={showModal}
        location={selectedLocation}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warningLight,
    marginBottom: -20,
  },

  mapContainer: { flex: 1 },
  mapFull: { flex: 1, position: "relative" },
  mapImage: { borderRadius: 0 },

  modernFilterBar: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: "hidden",
  },
  filterGradient: { paddingVertical: 20, paddingTop: 24 },
  filterScrollView: { paddingLeft: 20, paddingBottom: 24 },
  filterScrollContent: { paddingRight: 20 },
  modernFilterChip: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 25,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.cream,
  },
  filterChipContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    position: "relative",
  },
  modernFilterText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  activeModernFilterText: { color: colors.white, fontWeight: "700" },
  selectedIndicator: {
    position: "absolute",
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
