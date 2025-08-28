import { StatusBar } from "expo-status-bar";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StripeProvider } from "@stripe/stripe-react-native";
import { MainTabNavigator } from "@/navigates";
import { RootStackParamList } from "@/utils";
import { CustomDrawerContent } from "@/components";
import { ThemeProvider, useTheme } from "@/themes/theme";
import store from "@/reduxs/store";

// const STRIPE_PUBLISHABLE_KEY =
//   process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51P8zpUJDEspePZjo73Y0CF0vnLNm4em25JMvdXDYvGxCpUC5YL0CHTcTvx5Mo93MiKlzaWJIYUUmgCnGf6J2nH2M00DAUzDZYs";

const Drawer = createDrawerNavigator<RootStackParamList>();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </ReduxProvider>
  );
}

function ThemedApp() {
  const { theme } = useTheme();

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier="merchant.com.primo.piazza"
        urlScheme="primoapp"
      >
        <NavigationContainer>
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ headerShown: false }}
          >
            <Drawer.Screen name="Main" component={MainTabNavigator} />
          </Drawer.Navigator>
        </NavigationContainer>
      </StripeProvider>
    </PaperProvider>
  );
}
