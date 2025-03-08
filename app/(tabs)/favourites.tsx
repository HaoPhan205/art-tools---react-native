import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useRouter } from "expo-router";

import { useSearch } from "~/components/SearchContext";

interface ArtItem {
  id: string;
  artName: string;
  price: number;
  limitedTimeDeal?: number;
  image: string;
}

export default function FavoriteList() {
  const [favorites, setFavorites] = useState<ArtItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();

  const loadFavorites = useCallback(async () => {
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
  }, []);

  const removeFavorite = useCallback(
    async (id: string) => {
      try {
        const updatedFavorites = favorites.filter((item) => item.id !== id);
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error("Lỗi khi xoá khỏi danh sách yêu thích:", error);
      }
    },
    [favorites]
  );

  const handlePress = useCallback(
    (id: string) => {
      if (selectionMode) {
        setSelectedItems((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return newSet;
        });
      } else {
        router.push(`/detail/${id}`);
      }
    },
    [selectionMode, router]
  );

  const handleLongPress = useCallback(() => {
    setSelectionMode(true);
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    try {
      const updatedFavorites = favorites.filter(
        (item) => !selectedItems.has(item.id)
      );
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      setSelectedItems(new Set());
      setSelectionMode(false);
    } catch (error) {
      console.error("Lỗi khi xoá khỏi danh sách yêu thích:", error);
    }
  }, [favorites, selectedItems]);

  const handleDeleteAll = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("favorites");
      setFavorites([]);
      setSelectedItems(new Set());
      setSelectionMode(false);
    } catch (error) {
      console.error("Lỗi khi xoá tất cả khỏi danh sách yêu thích:", error);
    }
  }, []);

  const handleCancelSelection = useCallback(() => {
    setSelectedItems(new Set());
    setSelectionMode(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => removeFavorite(id)}
    >
      <Text style={styles.deleteButtonText}>Xóa</Text>
    </TouchableOpacity>
  );

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
  };

  const filteredFavorites = favorites.filter((item) =>
    item.artName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {selectionMode && (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={handleDeleteSelected}>
            <Text style={styles.actionText}>Xóa đã chọn</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAll}>
            <Text style={styles.actionText}>Xóa tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelSelection}>
            <Text style={styles.actionText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      )}
      {filteredFavorites.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const discountedPrice = item.limitedTimeDeal
              ? item.price * (1 - item.limitedTimeDeal)
              : item.price;
            const discountPercent = item.limitedTimeDeal
              ? (item.limitedTimeDeal * 100).toFixed(0)
              : null;

            return (
              <Swipeable
                renderRightActions={() => renderRightActions(item.id)}
                friction={2}
                overshootRight={false}
              >
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    selectedItems.has(item.id) && styles.selectedItem,
                  ]}
                  onPress={() => handlePress(item.id)}
                  onLongPress={handleLongPress}
                >
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text style={styles.artName}>{item.artName}</Text>
                    <View style={styles.priceContainer}>
                      {item.limitedTimeDeal ? (
                        <>
                          <Text>
                            <Text style={styles.originalPrice}>
                              ${formatPrice(item.price)}
                            </Text>
                            <Text style={styles.discountPercent}>
                              -{discountPercent}%
                            </Text>
                          </Text>
                          <Text style={styles.discountedPrice}>
                            ${formatPrice(discountedPrice)}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.realPrice}>
                          ${formatPrice(item.price)}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
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
    zIndex: 1,
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
    overflow: "hidden",
    borderColor: "#6ec2f7",
    borderWidth: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 120,
    padding: 10,
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  artName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flex: 1,
  },
  discountedPrice: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
    color: "gray",
    marginLeft: 5,
  },
  discountPercent: {
    fontSize: 12,
    fontWeight: "bold",
    color: "red",
    marginLeft: 5,
  },
  realPrice: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    zIndex: 0,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
});
