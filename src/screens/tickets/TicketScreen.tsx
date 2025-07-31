import { useState } from "react";
import { FAB, Title } from "react-native-paper";
import { View, FlatList, StyleSheet } from "react-native";
import { useGetTicketsQuery } from "@/reduxs/apis/ticket.api";
import { Header, TicketCard, Loading } from "@/components";
import { myNavigation, colors } from "@/utils";

const TicketScreen = () => {
  const navigation = myNavigation();
  const { data: tickets = [], isLoading } = useGetTicketsQuery({});
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const increaseQuantity = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const resetQuantities = () => {
    setQuantities({});
  };

  const setQuantity = (id: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      <Header options={{ title: "ตั๋ว" }} />

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.ticketId}
        ListHeaderComponent={
          <Title style={styles.titleText}>เลือกตั๋วที่ต้องการซื้อ</Title>
        }
        renderItem={({ item }) => (
          <TicketCard
            data={item}
            quantity={quantities[item.ticketId] || 0}
            increaseQuantity={() => increaseQuantity(item.ticketId)}
            decreaseQuantity={() => decreaseQuantity(item.ticketId)}
            setQuantity={(value: any) => setQuantity(item.ticketId, value)}
          />
        )}
      />

      {Object.values(quantities).some((q) => q > 0) && (
        <View>
          <FAB
            style={styles.fab}
            label="ชำระเงิน"
            icon="cash-register"
            color={colors.white}
            onPress={() => {
              const selectedTickets = Object.entries(quantities)
                .filter(([_, qty]) => qty > 0)
                .map(([id, qty]) => `${id}:${qty}`);

              const total = tickets.reduce((sum: any, item: any) => {
                const quantity = quantities[item.ticketId] || 0;
                return sum + quantity * (item.price || 0);
              }, 0);

              navigation.navigate("ชำระเงิน", {
                title: "TicketScreen",
                price: total,
                ticketIds: selectedTickets,
              });
            }}
          />

          <FAB
            style={styles.fabReset}
            label="ยกเลิก"
            icon="close"
            color={colors.white}
            onPress={resetQuantities}
          />
        </View>
      )}
    </View>
  );
};

export default TicketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: colors.accentGreen,
  },
  fabReset: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: colors.accentGold,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 16,
    marginLeft: 16,
    alignSelf: "flex-start",
    textAlign: "left",
    color: colors.textPrimary,
  },
});
