import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
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
  hideFavoriteIcon?: boolean;
  loadFavorites?: () => Promise<void>;
}

export default function ArtCard({
  item,
  isLast,
  hideFavoriteIcon,
}: ArtCardProps) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });

    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    if (favorites) {
      const parsedFavorites: ArtItem[] = JSON.parse(favorites);
      setIsFavorite(parsedFavorites.some((fav) => fav.id === item.id));
    }
  };

  const toggleFavorite = async () => {
    try {
      let favorites = await AsyncStorage.getItem("favorites");
      let updatedFavorites: ArtItem[] = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        updatedFavorites = updatedFavorites.filter((fav) => fav.id !== item.id);
      } else {
        updatedFavorites.push(item);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Lỗi khi lưu yêu thích:", error);
    }
  };

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
      {item.limitedTimeDeal !== undefined && item.limitedTimeDeal > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            -{Math.round(item.limitedTimeDeal * 100)}%
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

      {!hideFavoriteIcon && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <AntDesign
            name={isFavorite ? "heart" : "hearto"}
            size={24}
            color="red"
          />
        </TouchableOpacity>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.artName}
        </Text>
        <Text style={styles.price}>
          {item.price ? item.price.toString() + " $" : "N/A"}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    shadowOpacity: 0.05,

    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
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
    paddingHorizontal: 4,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
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
  favoriteButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 15,
  },
});
