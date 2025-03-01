import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import ArtCard from "../../components/ArtCard";
import { useSearch } from "~/components/SearchContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ArtItem {
  id: string;
  artName: string;
  price: number;
  limitedTimeDeal?: number;
  image: string;
  feedbacks: {
    rating: number;
  };
}

export default function HomeScreen() {
  const [artList, setArtList] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites.map((fav: any) => fav.id));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích:", error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    axios
      .get("https://65f3f34a105614e654a18199.mockapi.io/art")
      .then((response) => {
        setArtList(response.data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const filteredArtList = searchQuery
    ? artList.filter((item) =>
        item.artName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : artList;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  if (!loading && artList.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không có sản phẩm nào!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredArtList}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) =>
          item.artName && item.image ? (
            <ArtCard
              item={item}
              loadFavorites={loadFavorites}
              isLast={
                index === filteredArtList.length - 1 &&
                filteredArtList.length % 2 !== 0
              }
            />
          ) : null
        }
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  list: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
