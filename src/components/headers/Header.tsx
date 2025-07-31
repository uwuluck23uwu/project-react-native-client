import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { colors } from "@/utils";

interface Props {
  options: {
    title?: string;
  };
}

const Header = ({ options }: Props) => {
  const { openDrawer } = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Appbar.Header style={styles.headerContainer}>
      <Appbar.Action
        icon="menu"
        color={colors.white}
        onPress={() => openDrawer()}
      />

      <Appbar.Content
        title={options?.title || "หน้าหลัก"}
        titleStyle={styles.headerTitle}
      />
    </Appbar.Header>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.primary,
    elevation: 4,
  },
  headerTitle: {
    color: colors.accentGold,
    fontSize: 18,
    fontWeight: "bold",
  },
});
