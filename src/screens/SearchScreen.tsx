import { useEffect, useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAnimals } from "@/reduxs/slices/animal.slice";
import { useGetAnimalsQuery } from "@/reduxs/apis/animal.api";
import { AppDispatch, RootState } from "@/reduxs/store";
import { searchWithFuse, colors } from "@/utils";
import { SearchItem, Loading, Search } from "@/components";

const SearchScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const { data = [], isLoading } = useGetAnimalsQuery({ pageSize: 100 });
  const animals = useSelector((state: RootState) => state.animal.animals);

  useEffect(() => {
    if (data.length > 0) {
      dispatch(setAnimals(data));
    }
  }, [data, dispatch]);

  const handleSearch = useCallback(
    debounce((text: string) => {
      setDebouncedSearchText(text);
    }, 300),
    []
  );

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
    handleSearch(text);
  };

  const filteredAnimals = useMemo(() => {
    return searchWithFuse(animals, debouncedSearchText, [
      "name",
      "species",
      "scientificName",
    ]);
  }, [animals, debouncedSearchText]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search
          value={searchText}
          onChangeText={onChangeSearchText}
          placeholder="ค้นหาชื่อสัตว์ / สายพันธุ์"
        />
      </View>

      <SearchItem
        data={filteredAnimals}
        isSearch={true}
        isSearchActive={!!debouncedSearchText}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.backgroundAlt,
  },
});
