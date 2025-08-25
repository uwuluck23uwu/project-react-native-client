import { View, Text, StyleSheet } from "react-native";
import {
  AntDesign,
  Ionicons,
  Feather,
  Fontisto,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const expoICON = {
  AntDesign,
  Ionicons,
  Feather,
  Fontisto,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
};

export type IconType = keyof typeof expoICON;

interface Prop {
  name?: string;
  icon: string;
  size: number;
  color?: string;
  type?: IconType;
}

const Icon = ({ type = "AntDesign", name, icon, size, color }: Prop) => {
  const Icon = expoICON[type];

  return (
    <View style={styles.serviceIcon}>
      <Icon name={icon} size={size} color={color} />
      <Text style={styles.textIcon}>{name}</Text>
    </View>
  );
};

export default Icon;

const styles = StyleSheet.create({
  serviceIcon: {
    alignItems: "center",
    marginTop: 10,
  },
  textIcon: {
    fontSize: 10,
  },
});
