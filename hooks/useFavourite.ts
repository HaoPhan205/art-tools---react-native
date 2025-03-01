import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ArtItem {
  id: string;
  artName: string;
  price: number;
  image: string;
  
}

export function useFavorites(id: string, item?: ArtItem) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const favorites = await AsyncStorage.getItem("favorites");
    if (favorites) {
      const parsedFavorites: ArtItem[] = JSON.parse(favorites);
      setIsFavorite(parsedFavorites.some((fav) => fav.id === id));
    }
  };

  const toggleFavorite = async () => {
    try {
      let favorites = await AsyncStorage.getItem("favorites");
      let updatedFavorites: ArtItem[] = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        updatedFavorites = updatedFavorites.filter((fav) => fav.id !== id);
      } else if (item) {
        updatedFavorites.push(item);
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Lỗi khi lưu yêu thích:", error);
    }
  };

  return { isFavorite, toggleFavorite };
}
