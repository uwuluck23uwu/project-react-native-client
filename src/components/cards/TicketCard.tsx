import { Card, Text, Button, TextInput } from "react-native-paper";
import { View, StyleSheet, Image } from "react-native";
import { Icon } from "@/components";
import { colors } from "@/utils";

const TicketCard = ({
  data,
  quantity,
  increaseQuantity,
  decreaseQuantity,
  setQuantity,
}: any) => {
  const { id, image, name, price } = data;

  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text variant="titleMedium" style={styles.title}>
            {name}
          </Text>
          <Text variant="bodyMedium" style={styles.price}>
            ราคา: {price}
          </Text>
          <View style={styles.counterContainer}>
            <Button
              mode="outlined"
              onPress={() => decreaseQuantity(id)}
              style={styles.counterButton}
            >
              <Icon
                type="AntDesign"
                icon="minus"
                size={14}
                color={colors.primary}
              />
            </Button>

            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={(text) => {
                const newQuantity =
                  text === "" ? 0 : Math.max(0, parseInt(text, 10) || 0);
                setQuantity(id, newQuantity);
              }}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              textColor={colors.textPrimary}
            />

            <Button
              mode="outlined"
              onPress={() => increaseQuantity(id)}
              style={styles.counterButton}
            >
              <Icon
                type="AntDesign"
                icon="plus"
                size={14}
                color={colors.primary}
              />
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.backgroundMain,
    borderColor: colors.platinum,
    borderWidth: 1,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 100,
    borderRadius: 8,
    marginLeft: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: colors.accentGreen,
    fontWeight: "bold",
    marginBottom: 6,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  quantityInput: {
    marginHorizontal: 10,
    fontSize: 16,
    backgroundColor: colors.white,
    width: 50,
    height: 40,
    textAlign: "center",
    borderRadius: 6,
  },
  counterButton: {
    borderColor: colors.secondary,
    borderRadius: 6,
    minWidth: 40,
    height: 40,
    justifyContent: "center",
  },
});
