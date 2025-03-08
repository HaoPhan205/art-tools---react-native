import React, { useEffect } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const shoppingCartImage = require("../assets/shopping-cart.gif");

export default function HomeScreen() {
  const router = useRouter();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1.2, { damping: 2, stiffness: 100 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={shoppingCartImage}
        style={[styles.logo, animatedStyle]}
      />
      <Text style={styles.welcomeText}>Chào mừng đến với cửa hàng!</Text>
      <Text style={styles.description}>
        Khám phá những sản phẩm tuyệt vời {"\n"}và ưu đãi đặc biệt chỉ có tại
        đây.
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Thăm cửa hàng"
          onPress={() => router.push("/home")}
          color="#6200EE"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 10,
    width: "80%",
    borderRadius: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
