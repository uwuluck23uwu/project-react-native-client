import { memo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { TouchableRipple, Text, Surface } from "react-native-paper";
import { Icon, ShortCard, LongCard } from "..";
import { Animal } from "@/interfaces/animal.interface";
import myNavigation from "../../utils/myNavigation";
import colors from "@/utils/colors";

interface SearchItemProps {
  data: Animal[];
  isSearch?: boolean;
  isSearchActive: boolean;
}

const SearchItem = memo(
  ({ data, isSearch = false, isSearchActive }: SearchItemProps) => {
    const navigation = myNavigation();

    const renderItem = ({ item }: { item: Animal }) => {
      if (isSearch && isSearchActive) {
        return (
          <ShortCard
            data={item}
            onPress={() => {
              if ("image" in item) {
                navigation.navigate("รายละเอียด", { animal: item });
              } else {
                console.error("Item is not an Animal");
              }
            }}
          />
        );
      } else {
        return (
          <LongCard
            data={item}
            width={400}
            height={200}
            onPress={() => {
              navigation.navigate("รายละเอียด", { animal: item });
            }}
          />
        );
      }
    };

    return (
      <FlatList
        key={isSearchActive ? "searchActive" : "searchInactive"}
        numColumns={2}
        data={data}
        keyExtractor={(item) => item.animalId.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
      />
    );
  }
);

export default SearchItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconSearchContainer: {
    flex: 1,
    margin: 35,
  },
  iconSearchContent: {
    alignItems: "center",
  },
  iconSearchIconContainer: {
    backgroundColor: colors.accentGreen,
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  iconSearchText: {
    fontSize: 14,
    marginTop: 8,
    color: colors.textSecondary,
    textAlign: "center",
  },
  flatList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.backgroundAlt,
  },
});
