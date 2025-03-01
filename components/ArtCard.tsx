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
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

interface ArtItem {
  id: string;
  artName: string;
  price: number;
  limitedTimeDeal?: number;
  image: string;
  feedbacks: { rating: number }[];
}

interface ArtCardProps {
  item: ArtItem;
  isLast?: boolean;
  hideFavoriteIcon?: boolean;
  loadFavorites?: () => Promise<void>;
}

export default function ArtCard({
  item,
  hideFavoriteIcon,
  loadFavorites,
}: ArtCardProps) {
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

      if (loadFavorites) {
        await loadFavorites();
      }
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

  const discountedPrice = item.limitedTimeDeal
    ? item.price * (1 - item.limitedTimeDeal)
    : item.price;

  const validRatings = item.feedbacks
    ?.map((fb) => Number(fb.rating))
    .filter((r) => !isNaN(r));
  const averageRating =
    validRatings && validRatings.length > 0
      ? (
          validRatings.reduce((sum, rating) => sum + rating, 0) /
          validRatings.length
        ).toFixed(1)
      : "N/A";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/detail/${item.id}`)}
      activeOpacity={0.7}
    >
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
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1A73E8" />
          </View>
        )}

        <Image
          source={{ uri: item.image }}
          style={[styles.image, isLoading && { opacity: 0 }]}
          onLoad={() => setIsLoading(false)}
          resizeMode="cover"
        />
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color="gold" />
          <Text style={styles.ratingText}>{averageRating}</Text>
        </View>

        {!hideFavoriteIcon && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <AntDesign
              name={isFavorite ? "heart" : "hearto"}
              size={22}
              color="red"
            />
          </TouchableOpacity>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {item.artName}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          {item.limitedTimeDeal && (
            <Text style={styles.discountedPrice}>
              Giảm còn: ${discountedPrice.toFixed(2)}
            </Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
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
    width: 180,
    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: 140,
    marginBottom: 10,
    resizeMode: "cover",
  },

  loaderContainer: {
    width: "100%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#f5f5f5",
    zIndex: 5,
  },
  textContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 5,
    position: "relative",
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
    marginTop: 10,
  },
  discountBadge: {
    backgroundColor: "red",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
    zIndex: 10,
  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 15,
    zIndex: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 10,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    marginTop: 5,
  },
});
