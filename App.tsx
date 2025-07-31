import { StatusBar } from "expo-status-bar";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import { sizeStyles, wp, hp } from '@/styles/sizeStyles';
import { MainTabNavigator } from "@/navigates";
import { RootStackParamList } from "@/utils";
import { CustomDrawerContent } from "@/components";
import { ThemeProvider, useTheme } from "@/themes/theme";
import store from "@/reduxs/store";

const Drawer = createDrawerNavigator<RootStackParamList>();

export default function App() {
  const { theme } = useTheme();

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <ThemeProvider>
          <StatusBar style="auto" />
          <NavigationContainer>
            <Drawer.Navigator
              drawerContent={(props) => <CustomDrawerContent {...props} />}
              screenOptions={{ headerShown: false }}
            >
              <Drawer.Screen name="Main" component={MainTabNavigator} />
            </Drawer.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}

// const styles = StyleSheet.create({
//   cardContainer: {
//     ...sizeStyles.container,
//     margin: wp(2),
//     borderRadius: wp(2),
//     borderWidth: 1,
//     borderColor: colors.border,
//     overflow: 'hidden',
//   },
//   cardImage: {
//     width: '100%',
//     height: hp(20),
//   },
//   cardContent: {
//     padding: wp(4),
//   },
//   title: {
//     ...sizeStyles.text,
//     fontSize: wp(5),
//     fontWeight: 'bold',
//     marginBottom: wp(1),
//   },
// });
