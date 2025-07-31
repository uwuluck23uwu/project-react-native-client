import { useEffect, useRef, useState, useMemo } from "react";
import { sampleSize } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Paragraph, Title } from "react-native-paper";
import { FlatList, Pressable, View, StyleSheet } from "react-native";
import { setAnimals } from "@/reduxs/slices/animal.slice";
import { useGetAnimalsQuery } from "@/reduxs/apis/animal.api";
import { myNavigation, colors } from "@/utils";
import { AppDispatch, RootState } from "@/reduxs/store";
import { LongCard, ShortCard, HomeHeader, Loading, Search } from "@/components";

const HomeScreen = () => {
  const { navigate } = myNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const flatListRef = useRef<FlatList>(null);

  const { data = [], isLoading } = useGetAnimalsQuery({ pageSize: 100 });
  const animals = useSelector((state: RootState) => state.animal.animals);

  const [currentIndex, setCurrentIndex] = useState(0);
  const topAnimals = useMemo(() => animals.slice(0, 5), [animals]);
  const randomAnimals = useMemo(() => sampleSize(animals, 4), [animals]);

  useEffect(() => {
    if (data?.length > 0) {
      dispatch(setAnimals(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (topAnimals.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % topAnimals.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [topAnimals]);

  if (isLoading) return <Loading />;

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={
        <View>
          <HomeHeader />

          <Card style={styles.mapCard}>
            <Card.Content>
              <Title>เยี่ยมชมสัตว์ต่างๆ</Title>
              <Paragraph>นำทางผ่านแผนที่ในสวนสัตว์</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" buttonColor={colors.accentGreen}>
                แผนที่
              </Button>
            </Card.Actions>
          </Card>

          <Pressable onPress={() => navigate("ค้นหา")}>
            <Search
              value=""
              onChangeText={() => {}}
              editable={false}
              placeholder="ค้นหาสัตว์ที่ต้องการ"
            />
          </Pressable>

          <View style={styles.section}>
            <Title style={styles.titleText}>สัตว์ยอดนิยม</Title>
            <FlatList
              horizontal
              ref={flatListRef}
              data={topAnimals}
              keyExtractor={(item) => item.animalId}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <LongCard
                  data={item}
                  width={400}
                  height={300}
                  onPress={() => navigate("รายละเอียด", { animal: item })}
                />
              )}
              ListEmptyComponent={<Paragraph>ไม่มีข้อมูลสัตว์แนะนำ</Paragraph>}
            />
          </View>

          <View style={styles.section}>
            <Title style={styles.titleText}>สัตว์แนะนำ</Title>
          </View>
        </View>
      }
      data={randomAnimals}
      keyExtractor={(item) => item.animalId}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      renderItem={({ item }) => (
        <ShortCard
          data={item}
          onPress={() => navigate("รายละเอียด", { animal: item })}
        />
      )}
      ListEmptyComponent={<Paragraph>ไม่มีข้อมูลสัตว์ทั้งหมด</Paragraph>}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
    backgroundColor: colors.backgroundMain,
  },
  mapCard: {
    marginBottom: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.textPrimary,
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
