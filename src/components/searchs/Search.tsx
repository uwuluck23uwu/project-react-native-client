import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { colors } from "@/utils";

type SearchProps = {
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
}: SearchProps) => {
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
    backgroundColor: colors.backgroundAlt,
    marginHorizontal: 16,
    borderRadius: 8,
  },
});
