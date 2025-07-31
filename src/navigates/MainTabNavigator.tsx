import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@/components";
import { colors, RootStackParamList } from "@/utils";
import StackNavigation from "./StackNavigation";

const Tab = createBottomTabNavigator<RootStackParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accentGold,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 80,
          backgroundColor: colors.backgroundAlt,
          borderTopColor: colors.platinum,
        },
      }}
    >
      <Tab.Screen
        name="หน้าหลัก"
        component={StackNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon
              type="Ionicons"
              name="สัตว์"
              icon="paw-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ตั๋ว"
        component={StackNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon
              type="Ionicons"
              name="บัตร์"
              icon="ticket-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ชำระเงิน"
        component={StackNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon
              type="FontAwesome5"
              name="บริจาค"
              icon="donate"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="บัญชี"
        component={StackNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Icon
              type="Ionicons"
              name="ตั้งค่า"
              icon="settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
