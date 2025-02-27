import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "expo-router";

interface ArtItem {
  id: string;
  artName: string;
  price: number;
  limitedTimeDeal?: number;
  image: string;
}

interface ArtCardProps {
  item: ArtItem;
  isLast?: boolean;
}

export default function ArtCard({ item, isLast }: ArtCardProps) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      onTouchStart={() => {
        scale.value = withSpring(0.95);
        rotate.value = withSpring(-2);
      }}
      onTouchEnd={() => {
        scale.value = withSpring(1);
        rotate.value = withSpring(0);
      }}
    >
      {item.limitedTimeDeal !== undefined && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            -{item.limitedTimeDeal.toString()}%
          </Text>
        </View>
      )}

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1A73E8" />
        </View>
      )}

      <Image
        source={{ uri: item.image }}
        style={[styles.image, isLoading && { opacity: 0 }]}
        onLoad={() => setIsLoading(false)}
      />

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.artName}
        </Text>
        <Text style={styles.price}>{item.price.toString()} $</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    margin: 5,
    shadowColor: "#000",

    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  loaderContainer: {
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  textContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    lineHeight: 22,
    marginRight: 10,
    marginLeft: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A73E8",
    margin: 10,
  },
  discountBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
    zIndex: 1,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
