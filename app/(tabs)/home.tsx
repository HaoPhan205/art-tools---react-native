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

interface ArtItem {
  id: string;
  artName: string;
  price: number;
  limitedTimeDeal?: number;
  image: string;
}

export default function HomeScreen() {
  const [artList, setArtList] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();

  useEffect(() => {
    axios
      .get("https://65f3f34a105614e654a18199.mockapi.io/art")
      .then((response) => {
        const formattedData: ArtItem[] = response.data.map((item: any) => ({
          id: item.id || "",
          artName: item.artName || "Unknown Art",
          price: item.price || 0,
          limitedTimeDeal: item.limitedTimeDeal,
          image: item.image || "https://via.placeholder.com/150",
        }));
        setArtList(formattedData);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const filteredArtList = artList.filter((item) =>
    item.artName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
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
    paddingHorizontal: 10,
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
