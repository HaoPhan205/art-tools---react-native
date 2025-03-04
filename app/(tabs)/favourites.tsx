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

  const handleLongPress = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleDeleteSelected = useCallback(async () => {
    try {
      const updatedFavorites = favorites.filter(
        (item) => !selectedItems.has(item.id)
      );
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Lỗi khi xoá khỏi danh sách yêu thích:", error);
    }
  }, [favorites, selectedItems]);

  const handleDeleteAll = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("favorites");
      setFavorites([]);
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Lỗi khi xoá tất cả khỏi danh sách yêu thích:", error);
    }
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

  return (
    <View style={styles.container}>
      {selectedItems.size > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={handleDeleteSelected}>
            <Text style={styles.actionText}>Xóa đã chọn</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAll}>
            <Text style={styles.actionText}>Xóa tất cả</Text>
          </TouchableOpacity>
        </View>
      )}
      {favorites.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
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
                onLongPress={() => handleLongPress(item.id)}
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.artName}>{item.artName}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{item.price} $</Text>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
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
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "flex-start",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 100,
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
    justifyContent: "flex-start",
  },
  artName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 5,
    right: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  price: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 100,
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
