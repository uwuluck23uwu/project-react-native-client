import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Modal, Portal, Surface, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/utils/colors";
import { Icon } from "@/components";

export type Marker = {
  id: string;
  name: string;
  x: number;
  y: number;
  description: string;
  activities: string[];
  color: string;
  icon: string;
  iconType:
    | "MaterialCommunityIcons"
    | "AntDesign"
    | "Feather"
    | "Ionicons"
    | "FontAwesome"
    | "FontAwesome5";
};

type Prop = {
  visible: boolean;
  location: Marker | null;
  onClose: () => void;
};

const MapModal = ({ visible, location, onClose }: Prop) => {
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(modalAnim, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modalWrapper}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  scale: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
                {
                  translateY: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
              opacity: modalAnim,
            },
          ]}
        >
          {location && (
            <Surface style={styles.card} elevation={5}>
              <LinearGradient
                colors={[location.color, colors.white]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
              >
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <Surface style={styles.avatar} elevation={5}>
                      <LinearGradient
                        colors={[location.color, `${location.color}CC`]}
                        style={styles.avatarGradient}
                      >
                        <Icon
                          icon={location.icon}
                          type={location.iconType}
                          size={36}
                          color={colors.white}
                        />
                      </LinearGradient>
                    </Surface>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.title}>{location.name}</Text>
                      <Text style={styles.subtitle}>
                        สถานที่ท่องเที่ยวใน Primo Piazza
                      </Text>
                    </View>
                  </View>

                  <View style={styles.closeBtn} onTouchEnd={onClose}>
                    <Icon
                      icon="close"
                      type="MaterialCommunityIcons"
                      size={24}
                      color={colors.white}
                    />
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.content}>
                {location.description ? (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Icon
                        icon="text-box-outline"
                        type="MaterialCommunityIcons"
                        size={20}
                        color={location.color}
                      />
                      <Text style={styles.sectionTitle}>รายละเอียด</Text>
                    </View>
                    <Text style={styles.desc}>{location.description}</Text>
                  </View>
                ) : (
                  <View style={styles.section}>
                    <Text style={styles.noDesc}>ไม่มีรายละเอียดเพิ่มเติม</Text>
                  </View>
                )}

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Icon
                      icon="playlist-check"
                      type="MaterialCommunityIcons"
                      size={20}
                      color={location.color}
                    />
                    <Text style={styles.sectionTitle}>กิจกรรมที่ทำได้</Text>
                  </View>
                  <View style={styles.activities}>
                    {location.activities.map((act, i) => (
                      <Surface
                        key={`${act}-${i}`}
                        style={[
                          styles.activityChip,
                          { borderColor: location.color },
                        ]}
                        elevation={2}
                      >
                        <Text
                          style={[
                            styles.activityText,
                            { color: location.color },
                          ]}
                        >
                          {act}
                        </Text>
                      </Surface>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.actions}>
                <Surface
                  style={[styles.actionBtn, styles.primaryBtn]}
                  elevation={5}
                  onTouchEnd={onClose}
                >
                  <View style={styles.actionBtnContent}>
                    <Icon
                      icon="navigation"
                      type="MaterialCommunityIcons"
                      size={20}
                      color={colors.white}
                    />
                    <Text style={styles.primaryText}>ปิด</Text>
                  </View>
                </Surface>
              </View>
            </Surface>
          )}
        </Animated.View>
      </Modal>
    </Portal>
  );
};

export default MapModal;

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black50,
    padding: 20,
  },
  container: { width: "100%", maxWidth: 420 },
  card: { backgroundColor: colors.white, borderRadius: 24, overflow: "hidden" },
  headerGradient: { paddingBottom: 20 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 24,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    overflow: "hidden",
  },
  avatarGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  content: { padding: 24 },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginLeft: 8,
  },
  desc: { fontSize: 15, color: "#5D4E75", lineHeight: 22 },
  noDesc: {
    fontSize: 14,
    color: "#9E9E9E",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },
  activities: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  activityChip: {
    backgroundColor: "#f0f4f8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  activityText: { fontSize: 13, fontWeight: "500" },
  actions: {
    flexDirection: "row",
    padding: 24,
    gap: 12,
    backgroundColor: "#f8f9fa",
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  primaryBtn: { backgroundColor: "#000000ff" },
  actionBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionText: { fontSize: 16, fontWeight: "600", color: "#666" },
  primaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
});
