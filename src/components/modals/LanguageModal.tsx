import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/translations";
import colors from "@/utils/colors";

const { width, height } = Dimensions.get("window");

interface LanguageModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  onDismiss,
}) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const t = useTranslation(currentLanguage);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleLanguageSelect = async (language: "th" | "en") => {
    await changeLanguage(language);
    onDismiss();
  };

  const languages = [
    {
      code: "th" as const,
      name: "ภาษาไทย",
      englishName: "Thai",
      flag: "🇹🇭",
      icon: "earth" as const,
    },
    {
      code: "en" as const,
      name: "ภาษาอังกฤษ",
      englishName: "English",
      flag: "🇺🇸",
      icon: "earth-outline" as const,
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <BlurView intensity={20} tint="dark" style={styles.blurView}>
          <Pressable style={styles.backdrop} onPress={onDismiss} />

          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.white, colors.backgroundCard]}
              style={styles.modalContent}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <LinearGradient
                    colors={["#4facfe", "#00f2fe"]}
                    style={styles.headerIcon}
                  >
                    <MaterialCommunityIcons
                      name="earth"
                      size={24}
                      color={colors.white}
                    />
                  </LinearGradient>
                  <View>
                    <Text style={styles.headerTitle}>
                      {t("การตั้งค่าภาษา")}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {t("เปลี่ยนภาษาของแอปพลิเคชัน")}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={onDismiss} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.textTertiary}
                  />
                </Pressable>
              </View>

              {/* Language Options */}
              <ScrollView
                style={styles.languageList}
                showsVerticalScrollIndicator={false}
              >
                {languages.map((language, index) => {
                  const isSelected = currentLanguage === language.code;

                  return (
                    <Pressable
                      key={language.code}
                      onPress={() => handleLanguageSelect(language.code)}
                      style={({ pressed }) => [
                        styles.languageOption,
                        pressed && styles.languageOptionPressed,
                        isSelected && styles.languageOptionSelected,
                      ]}
                    >
                      <LinearGradient
                        colors={
                          isSelected
                            ? ["#4facfe", "#00f2fe"]
                            : [colors.white, colors.backgroundCard]
                        }
                        style={styles.languageGradient}
                      >
                        <View style={styles.languageLeft}>
                          <View
                            style={[
                              styles.flagContainer,
                              isSelected && styles.flagContainerSelected,
                            ]}
                          >
                            <Text style={styles.flagEmoji}>
                              {language.flag}
                            </Text>
                          </View>
                          <View style={styles.languageTextContainer}>
                            <Text
                              style={[
                                styles.languageName,
                                isSelected && styles.languageNameSelected,
                              ]}
                            >
                              {currentLanguage === "th"
                                ? language.name
                                : language.englishName}
                            </Text>
                            <Text
                              style={[
                                styles.languageSubtitle,
                                isSelected && styles.languageSubtitleSelected,
                              ]}
                            >
                              {currentLanguage === "th"
                                ? language.englishName
                                : language.name}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.languageRight}>
                          {isSelected && (
                            <View style={styles.selectedIndicator}>
                              <LinearGradient
                                colors={[colors.white, colors.backgroundCard]}
                                style={styles.selectedGradient}
                              >
                                <Ionicons
                                  name="checkmark-circle"
                                  size={24}
                                  color="#4facfe"
                                />
                              </LinearGradient>
                            </View>
                          )}
                        </View>
                      </LinearGradient>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {currentLanguage === "th"
                    ? "การเปลี่ยนแปลงจะมีผลทันที"
                    : "Changes will take effect immediately"}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
};

export default LanguageModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  blurView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: height * 0.6,
  },
  modalContent: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.platinum + "30",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  languageList: {
    maxHeight: 300,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  languageOption: {
    marginVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
  },
  languageOptionPressed: {
    transform: [{ scale: 0.98 }],
  },
  languageOptionSelected: {
    shadowColor: "#4facfe",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  languageGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flagContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  flagContainerSelected: {
    backgroundColor: colors.white + "20",
  },
  flagEmoji: {
    fontSize: 24,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  languageNameSelected: {
    color: colors.white,
  },
  languageSubtitle: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  languageSubtitleSelected: {
    color: colors.white + "80",
  },
  languageRight: {
    width: 40,
    alignItems: "center",
  },
  selectedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  selectedGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.platinum + "30",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: "center",
  },
});
