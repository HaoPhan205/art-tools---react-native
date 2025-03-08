import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface Feedback {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

interface ArtItem {
  id: string;
  artName: string;
  price: number;
  description: string;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal?: number;
  feedbacks: Feedback[];
}

const formatPrice = (price: number) => {
  return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams() as { id: string };
  const [artItem, setArtItem] = useState<ArtItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchArtItem = async () => {
      try {
        const response = await axios.get(
          `https://65f3f34a105614e654a18199.mockapi.io/art/${id}`
        );
        setArtItem(response.data);
        checkFavoriteStatus(response.data.id);
      } catch (error) {
        console.error("Error fetching art item:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtItem();
  }, [id]);

  const checkFavoriteStatus = async (itemId: string) => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setIsFavorite(parsedFavorites.some((fav: any) => fav.id === itemId));
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = useCallback(async () => {
    if (!artItem) return;
    try {
      let favorites = await AsyncStorage.getItem("favorites");
      let updatedFavorites: ArtItem[] = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        updatedFavorites = updatedFavorites.filter(
          (fav) => fav.id !== artItem.id
        );
        Toast.show({
          type: "success",
          text1: "Đã xoá khỏi mục yêu thích",
          text2: `${artItem.artName} đã được xoá khỏi mục yêu thích.`,
          position: "top",
          topOffset: 150,
        });
      } else {
        updatedFavorites.push(artItem);
        Toast.show({
          type: "success",
          text1: "Đã thêm vào mục yêu thích",
          text2: `${artItem.artName} đã được thêm vào mục yêu thích.`,
          position: "top",
          topOffset: 150,
        });
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }, [artItem, isFavorite]);

  if (!id) return <Text>Lỗi: Không tìm thấy ID</Text>;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (!artItem) return <Text>Lỗi: Không thể tải sản phẩm</Text>;

  const discountedPrice = artItem.limitedTimeDeal
    ? artItem.price * (1 - artItem.limitedTimeDeal)
    : artItem.price;

  const validRatings = artItem.feedbacks.map((fb) => fb.rating);
  const averageRating =
    validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;

  return (
    <View style={styles.container}>
      <ScrollView>
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
        <Image source={{ uri: artItem.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.artName}>{artItem.artName}</Text>
          <Text style={styles.price}>
            Giá: ${formatPrice(discountedPrice)}
            {artItem.limitedTimeDeal && (
              <>
                <Text style={styles.originalPrice}>
                  {" "}
                  (${formatPrice(artItem.price)})
                </Text>
                <Text style={styles.discountPercent}>
                  {" "}
                  -{(artItem.limitedTimeDeal * 100).toFixed(0)}%
                </Text>
              </>
            )}
          </Text>
          <Text style={styles.descriptionTitle}>Mô tả sản phẩm:</Text>
          <Text style={styles.description}>{artItem.description}</Text>
          <Text style={styles.brand}>Thương hiệu: {artItem.brand}</Text>
        </View>
        <View style={styles.feedbackSection}>
          <View style={styles.feedbackHeader}>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.averageRating}>
                {averageRating.toFixed(1)}
              </Text>
            </View>
            <Text style={styles.feedbackTitle}>Đánh giá sản phẩm</Text>
            <Text style={styles.feedbackCount}>
              ({artItem.feedbacks.length} lượt đánh giá)
            </Text>
          </View>
          <ScrollView style={styles.feedbackList}>
            {artItem.feedbacks.map((feedback, index) => (
              <View key={index} style={styles.feedbackContainer}>
                <Text style={styles.feedbackAuthor}>{feedback.author}</Text>
                <Text style={styles.feedbackRating}>
                  <FontAwesome name="star" size={14} color="#FFD700" />{" "}
                  {feedback.rating}
                </Text>
                <Text style={styles.feedbackComment}>{feedback.comment}</Text>
                <Text style={styles.feedbackDate}>
                  {new Date(feedback.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  artName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  brand: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E91E63",
    marginBottom: 10,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "gray",
  },
  discountPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 5,
    borderRadius: 3,
    marginLeft: 5,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    lineHeight: 22,
  },
  feedbackSection: {
    padding: 20,
    paddingTop: 0,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  averageRating: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  feedbackCount: {
    fontSize: 16,
    color: "#666",
  },
  feedbackList: {
    maxHeight: 200,
  },
  feedbackContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  feedbackAuthor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackRating: {
    fontSize: 14,
    color: "#FFD700",
  },
  feedbackComment: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  feedbackDate: {
    fontSize: 12,
    color: "#999",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 15,
    zIndex: 10,
  },
});
