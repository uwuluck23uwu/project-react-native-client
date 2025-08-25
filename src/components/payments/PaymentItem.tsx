import React, { useRef, useEffect } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/components";
import { Payment } from "@/interfaces/payment.interface";
import { colors } from "@/utils";

type Prop = {
  item: Payment;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  bounceAnim: Animated.Value;
};

const PaymentItem = ({
  item,
  index,
  isSelected,
  onSelect,
  bounceAnim,
}: Prop) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 150,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index]);

  return (
    <Animated.View
      style={{
        opacity: animatedValue,
        transform: [
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={[styles.paymentCard, isSelected && styles.selectedCard]}
        onPress={() => onSelect(item.id)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={
            isSelected
              ? [colors.accentGoldLight, colors.accentGold]
              : [colors.white, colors.backgroundAlt]
          }
          style={styles.cardGradient}
        >
          <View style={styles.paymentCardContent}>
            <View
              style={[styles.iconContainer, { backgroundColor: item.color }]}
            >
              <Icon
                type={item.iconType}
                icon={item.icon}
                size={24}
                color={colors.white}
              />
            </View>

            <View style={styles.paymentTextContainer}>
              <Text
                style={[
                  styles.paymentMethodName,
                  isSelected && styles.selectedText,
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.paymentDescription,
                  isSelected && styles.selectedDescription,
                ]}
              >
                {item.description}
              </Text>
            </View>

            <View style={styles.checkContainer}>
              {isSelected && (
                <Animated.View
                  style={[
                    styles.checkIcon,
                    {
                      transform: [
                        {
                          scale: bounceAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.3],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Icon
                    type="AntDesign"
                    icon="checkcircle"
                    size={24}
                    color={colors.success}
                  />
                </Animated.View>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PaymentItem;

const styles = StyleSheet.create({
  paymentCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.platinum,
  },
  selectedCard: {
    elevation: 8,
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderColor: colors.accentGold,
  },
  cardGradient: {
    padding: 20,
  },
  paymentCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  paymentDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  selectedText: {
    color: colors.textPrimary,
  },
  selectedDescription: {
    color: colors.textSecondary,
  },
  checkContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
});
