import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

interface ArtItem {
  id: string;
  artName: string;
  price: number; // Giá gốc (USD)
  limitedTimeDeal?: number; // Giá sau khi giảm (USD)
  image: string;
}

export default function FavoriteList() {
  const [favorites, setFavorites] = useState<ArtItem[]>([]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const updatedFavorites = favorites.filter((item) => item.id !== id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Lỗi khi xoá khỏi danh sách yêu thích:", error);
    }
  };

  const handleLongPress = (id: string) => {
    Alert.alert(
      "Xóa khỏi yêu thích",
      "Bạn có chắc muốn xóa mục này khỏi danh sách yêu thích?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => removeFavorite(id),
          style: "destructive",
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const discountPercentage = item.limitedTimeDeal
              ? Math.round(item.limitedTimeDeal * 100)
              : null;
            return (
              <TouchableOpacity
                style={styles.listItem}
                onLongPress={() => handleLongPress(item.id)}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.artName}>{item.artName}</Text>
                  <Text style={styles.price}>
                    {item.price ? item.price.toString() + " $" : "N/A"}
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  {discountPercentage !== null && (
                    <Text style={styles.deal}>-{discountPercentage}%</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text style={styles.emptyText}>
          Không có tác phẩm nào trong danh sách yêu thích.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 50,
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  artName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: "#FF5733",
    fontWeight: "bold",
  },
  deal: {
    fontSize: 12,
    color: "#28A745",
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
