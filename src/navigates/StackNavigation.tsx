import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/utils";
import {
  HomeScreen,
  DetailsScreen,
  TicketScreen,
  UserTicketsScreen,
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
  OtpVerificationScreen,
  TicketScannerScreen,
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
        <Stack.Screen name="รายละเอียด" component={DetailsScreen} />
        <Stack.Screen name="สมาชิก" component={ApplyScreen} />
        <Stack.Screen name="สมัครสมาชิก" component={RegisterScreen} />
        <Stack.Screen name="เข้าสู่ระบบ" component={LoginScreen} />
        <Stack.Screen name="ยืนยันOTP" component={OtpVerificationScreen} />
        <Stack.Screen name="ค้นหา" component={SearchScreen} />
        <Stack.Screen name="แผนที่" component={MapScreen} />
        <Stack.Screen name="ตั๋ว" component={TicketScreen} />
        <Stack.Screen name="บัตรของฉัน" component={UserTicketsScreen} />
        <Stack.Screen name="สแกนบัตร" component={TicketScannerScreen} />
        <Stack.Screen name="ชำระเงิน" component={PaymentScreen} />
        <Stack.Screen name="เสร็จสิน" component={SuccessScreen} />
        <Stack.Screen name="ล้มเหลว" component={FailScreen} />
        <Stack.Screen name="ตั้งค่า" component={SettingScreen} />
        <Stack.Screen name="บัญชี" component={AccountScreen} />
      </Stack.Navigator>
    </GestureHandlerRootView>
  );
};

export default StackNavigation;
