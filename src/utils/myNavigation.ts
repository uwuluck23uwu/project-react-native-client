import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/utils";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const useMyNavigation = () => {
  return useNavigation<NavigationProp>();
};

export default useMyNavigation;
