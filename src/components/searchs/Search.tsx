import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { colors } from "@/utils";

type Prop = {
  value: string;
  onChangeText: (text: string) => void;
  onIconPress?: () => void;
  placeholder?: string;
  editable?: boolean;
};

const Search = ({
  value,
  onChangeText,
  onIconPress,
  placeholder = "ค้นหาสัตว์ที่ต้องการ",
  editable = true,
}: Prop) => {
  return (
    <TextInput
      mode="outlined"
      label={placeholder}
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      style={styles.searchInput}
      theme={{
        colors: {
          primary: colors.primary,
          text: colors.textPrimary,
          placeholder: colors.textSecondary,
          background: colors.backgroundAlt,
        },
      }}
      right={
        <TextInput.Icon
          icon="magnify"
          onPress={onIconPress}
          color={colors.accentGreen}
        />
      }
    />
  );
};

export default Search;

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: -10,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
