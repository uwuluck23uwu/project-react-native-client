import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { Appearance } from "react-native";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import colors from "@/utils/colors";

interface ThemeContextType {
  theme: typeof MD3LightTheme;
  toggleTheme: () => void;
}

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.backgroundMain,
    surface: colors.backgroundAlt,
    outline: colors.platinum,
    text: colors.textPrimary,
    onPrimary: colors.white,
    accent: colors.accentGold,
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: "#121212", // หรือใช้ colors.textPrimary ก็ได้ ถ้าต้องการ
    surface: "#1E1E1E",
    outline: colors.textSecondary,
    text: colors.white,
    onPrimary: colors.white,
    accent: colors.accentGreen,
  },
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkTheme, setIsDarkTheme] = useState(
    Appearance.getColorScheme() === "dark"
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkTheme(colorScheme === "dark");
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { ThemeProvider, useTheme };
