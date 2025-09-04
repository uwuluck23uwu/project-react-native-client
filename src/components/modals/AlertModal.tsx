import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { Text, Button, IconButton, Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Icon, { IconType } from "../Icon";
import colors from "@/utils/colors";

const { width, height } = Dimensions.get("window");

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
  color?: string;
}

interface Prop {
  visible: boolean;
  title?: string;
  message?: string;
  icon?: string;
  iconType?: IconType;
  iconColor?: string;
  type?: "success" | "error" | "warning" | "info" | "confirm";
  buttons?: AlertButton[];
  onDismiss?: () => void;
  showCloseButton?: boolean;
}

const AlertModal = ({
  visible,
  title,
  message,
  icon,
  iconType,
  iconColor,
  type = "info",
  buttons = [{ text: "ตกลง", style: "default" }],
  onDismiss,
  showCloseButton = false,
}: Prop) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }).start();
      }, 200);

      const shimmerLoop = Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      shimmerLoop.start();
      pulseLoop.start();

      return () => {
        shimmerLoop.stop();
        pulseLoop.stop();
      };
    } else {
      iconScaleAnim.setValue(0);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      slideAnim.setValue(50);
      overlayAnim.setValue(0);
    }
  }, [visible]);

  const getTypeConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: icon || "checkcircle",
          iconType: iconType || ("AntDesign" as IconType),
          iconColor: iconColor || colors.success,
          gradientColors: [colors.successLight, colors.white] as const,
          borderColor: colors.success,
          shimmerColor: colors.success + "30",
        };
      case "error":
        return {
          icon: icon || "closecircle",
          iconType: iconType || ("AntDesign" as IconType),
          iconColor: iconColor || colors.error,
          gradientColors: [colors.errorLight, colors.white] as const,
          borderColor: colors.error,
          shimmerColor: colors.error + "30",
        };
      case "warning":
        return {
          icon: icon || "warning",
          iconType: iconType || ("AntDesign" as IconType),
          iconColor: iconColor || colors.warning,
          gradientColors: [colors.warningLight, colors.cream] as const,
          borderColor: colors.warning,
          shimmerColor: colors.warning + "30",
        };
      case "confirm":
        return {
          icon: icon || "questioncircle",
          iconType: iconType || ("AntDesign" as IconType),
          iconColor: iconColor || colors.primary,
          gradientColors: [colors.backgroundAlt, colors.white] as const,
          borderColor: colors.primary,
          shimmerColor: colors.primary + "30",
        };
      default:
        return {
          icon: icon || "infocirlce",
          iconType: iconType || ("AntDesign" as IconType),
          iconColor: iconColor || colors.tuscanSky,
          gradientColors: [colors.infoLight, colors.white] as const,
          borderColor: colors.tuscanSky,
          shimmerColor: colors.tuscanSky + "30",
        };
    }
  };

  const typeConfig = getTypeConfig();

  const handleBackdropPress = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  const renderButtons = () => {
    if (buttons.length === 1) {
      const button = buttons[0];
      return (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Button
            mode="contained"
            onPress={() => handleButtonPress(button)}
            style={[
              styles.singleButton,
              {
                backgroundColor: button.color || typeConfig.iconColor,
              },
            ]}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            {button.text}
          </Button>
        </Animated.View>
      );
    }

    return (
      <View style={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <Animated.View
            key={index}
            style={[{ flex: 1 }, { transform: [{ scale: pulseAnim }] }]}
          >
            <Button
              mode={button.style === "cancel" ? "outlined" : "contained"}
              onPress={() => handleButtonPress(button)}
              style={[
                styles.multiButton,
                button.style === "cancel" && {
                  borderColor: colors.platinum,
                },
                button.style === "destructive" && {
                  backgroundColor: colors.error,
                },
                button.style === "default" && {
                  backgroundColor: typeConfig.iconColor,
                },
              ]}
              labelStyle={[
                styles.buttonLabel,
                button.style === "cancel" && {
                  color: colors.textSecondary,
                },
              ]}
              contentStyle={styles.buttonContent}
            >
              {button.text}
            </Button>
          </Animated.View>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.alertContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
                },
              ]}
            >
              <Card
                style={[
                  styles.alertCard,
                  { borderTopColor: typeConfig.borderColor },
                ]}
              >
                <LinearGradient
                  colors={typeConfig.gradientColors}
                  style={styles.cardGradient}
                >
                  {/* Shimmer Effect */}
                  <Animated.View
                    style={[
                      styles.shimmerOverlay,
                      {
                        backgroundColor: typeConfig.shimmerColor,
                        transform: [{ translateX: shimmerTranslateX }],
                      },
                    ]}
                  />

                  {showCloseButton && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={onDismiss}
                    >
                      <IconButton
                        icon="close"
                        size={16}
                        iconColor={colors.textSecondary}
                        style={styles.closeIconButton}
                        onPress={onDismiss}
                      />
                    </TouchableOpacity>
                  )}

                  <Animated.View
                    style={[
                      styles.iconContainer,
                      {
                        transform: [{ scale: iconScaleAnim }],
                      },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.iconSurface,
                        {
                          backgroundColor: typeConfig.iconColor + "15",
                          transform: [{ scale: pulseAnim }],
                        },
                      ]}
                    >
                      <Icon
                        type={typeConfig.iconType}
                        icon={typeConfig.icon}
                        size={48}
                        color={typeConfig.iconColor}
                      />
                    </Animated.View>
                  </Animated.View>

                  <Animated.View
                    style={[
                      styles.contentContainer,
                      { transform: [{ translateY: slideAnim }] },
                    ]}
                  >
                    {title && (
                      <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={styles.title}>{title}</Text>
                      </Animated.View>
                    )}

                    {message && (
                      <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={styles.message}>{message}</Text>
                      </Animated.View>
                    )}
                  </Animated.View>

                  <Animated.View
                    style={[
                      styles.buttonsWrapper,
                      {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                      },
                    ]}
                  >
                    {renderButtons()}
                  </Animated.View>
                </LinearGradient>
              </Card>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: "100%",
    maxWidth: 340,
  },
  alertCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderTopWidth: 4,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardGradient: {
    padding: 0,
    position: "relative",
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    width: 100,
    height: "100%",
    opacity: 0.3,
    transform: [{ skewX: "-20deg" }],
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  closeIconButton: {
    margin: 0,
    padding: 0,
  },
  iconContainer: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 15,
  },
  iconSurface: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  contentContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212121",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 26,
  },
  message: {
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 5,
  },
  buttonsWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  singleButton: {
    borderRadius: 12,
    elevation: 2,
  },
  multiButton: {
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
