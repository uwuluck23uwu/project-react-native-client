import { View, Text, StyleSheet, ColorValue } from "react-native";
import { Portal, Modal } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import colors, { gradients } from "@/utils/colors";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface Prop {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  iconName?: IoniconName;
  iconGradient?: readonly [ColorValue, ColorValue];
}

const LogoutModal = ({
  visible,
  onDismiss,
  onConfirm,
  title,
  description,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  iconName = "alert-circle-outline",
  iconGradient = [colors.error, colors.errorLight],
}: Prop) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <LinearGradient
          colors={[colors.white, colors.backgroundCard]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <LinearGradient colors={iconGradient} style={styles.iconWrap}>
              <Ionicons name={iconName} size={32} color={colors.white} />
            </LinearGradient>
            <Text style={styles.title}>{title}</Text>
            {!!description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          <View style={styles.buttons}>
            <Text onPress={onDismiss} style={[styles.btn, styles.cancel]}>
              {cancelText}
            </Text>
            <LinearGradient
              colors={[colors.error, colors.errorDark]}
              style={styles.confirmWrap}
            >
              <Text onPress={onConfirm} style={[styles.btn, styles.confirm]}>
                {confirmText}
              </Text>
            </LinearGradient>
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
};

export default LogoutModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    margin: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradient: { padding: 25 },
  header: { alignItems: "center", marginBottom: 25 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  buttons: { flexDirection: "row", gap: 12 },
  btn: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  cancel: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.platinum,
    borderRadius: 12,
    color: colors.textSecondary,
  },
  confirmWrap: { flex: 1, borderRadius: 12, overflow: "hidden" },
  confirm: { paddingVertical: 12, color: colors.white },
});
