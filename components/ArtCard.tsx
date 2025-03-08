import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

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
  onFavoriteChange?: () => void;
  favorites: string[];
}

export default function ArtCard({
  item,
  hideFavoriteIcon,
  loadFavorites,
  onFavoriteChange,
  favorites,
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
    setIsFavorite(favorites.includes(item.id));
  }, [favorites, item.id]);

  const toggleFavorite = useCallback(async () => {
    try {
      let favorites = await AsyncStorage.getItem("favorites");
      let updatedFavorites: ArtItem[] = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        updatedFavorites = updatedFavorites.filter((fav) => fav.id !== item.id);
        Toast.show({
          type: "success",
          text1: "Đã xoá khỏi mục yêu thích",
          text2: `${item.artName} đã được xoá khỏi mục yêu thích.`,
          position: "top",
          topOffset: 150,
        });
      } else {
        updatedFavorites.push(item);
        Toast.show({
          type: "success",
          text1: "Đã thêm vào mục yêu thích",
          text2: `${item.artName} đã được thêm vào mục yêu thích.`,
          position: "top",
          topOffset: 150,
        });
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);

      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error("Lỗi khi lưu yêu thích:", error);
    }
  }, [item.id, isFavorite, item, onFavoriteChange]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
  };

  const discountedPrice = item.limitedTimeDeal
    ? item.price * (1 - item.limitedTimeDeal)
    : item.price;

  const validRatings =
    item.feedbacks && Array.isArray(item.feedbacks) && item.feedbacks.length > 0
      ? item.feedbacks.map((fb) => Number(fb.rating)).filter((r) => !isNaN(r))
      : [];

  const averageRating =
    validRatings.length > 0
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
        <Image
          source={{ uri: item.image }}
          style={[styles.image, isLoading && { opacity: 0 }]}
          onLoad={() => setIsLoading(false)}
          resizeMode="cover"
        />

        {validRatings.length > 0 ? (
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="gold" />
            <Text style={styles.ratingText}>{averageRating}</Text>
          </View>
        ) : null}

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
          <View style={styles.priceContainer}>
            {item.limitedTimeDeal ? (
              <>
                <Text style={styles.originalPrice}>
                  ${formatPrice(item.price)}
                </Text>
                <Text style={styles.discountPercent}>
                  -{(item.limitedTimeDeal * 100).toFixed(0)}%
                </Text>
                <Text style={styles.discountedPrice}>
                  ${formatPrice(discountedPrice)}
                </Text>
                <Text style={styles.savingsText}>
                  Tiết kiệm: ${formatPrice(item.price - discountedPrice)}
                </Text>
              </>
            ) : (
              <Text style={styles.realPrice}>${formatPrice(item.price)}</Text>
            )}
          </View>
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
    shadowOpacity: 0.05,
    width: 200,
    shadowRadius: 3,
    elevation: 5,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    alignSelf: "center",
    borderColor: "#6ec2f7",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 140,
    marginBottom: 10,
    resizeMode: "cover",
  },
  textContainer: {
    width: "100%",
    alignItems: "flex-start",
    padding: 8,
    position: "relative",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    lineHeight: 22,
    marginRight: 5,
    marginLeft: 5,
  },
  discountPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
  },
  favoriteButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
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
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    width: "100%",
  },
  savingsText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "green",
    marginTop: 2,
    marginBottom: 5,
  },
  realPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "gray",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
  },
});
