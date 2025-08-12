import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/utils";
import {
  HomeScreen,
  AnimalDetailsScreen,
  TicketScreen,
  // DonateScreen,
  PaymentScreen,
  SuccessScreen,
  AccountScreen,
  ApplyScreen,
  RegisterScreen,
  LoginScreen,
  SearchScreen,
  SettingScreen,
  FailScreen,
  MapScreen,
} from "@/screens";

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="หน้าหลัก" component={HomeScreen} />
        <Stack.Screen name="รายละเอียด" component={AnimalDetailsScreen} />
        <Stack.Screen
          name="สมาชิก"
          component={ApplyScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="สมัครสมาชิก"
          component={RegisterScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="เข้าสู่ระบบ"
          component={LoginScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ค้นหา"
          component={SearchScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="แผนที่" component={MapScreen} />
        <Stack.Screen name="ตั๋ว" component={TicketScreen} />
        <Stack.Screen name="ชำระเงิน" component={PaymentScreen} />
        <Stack.Screen name="เสร็จสิน" component={SuccessScreen} />
        <Stack.Screen name="ล้มเหลว" component={FailScreen} />
        <Stack.Screen name="การตั้งค่า" component={SettingScreen} />
        <Stack.Screen
          name="บัญชี"
          component={AccountScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

export default StackNavigation;
