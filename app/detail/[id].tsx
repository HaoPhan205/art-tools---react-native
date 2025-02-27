import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

interface ArtItem {
  id: string;
  artName: string;
  price: number;
  description: string;
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [artItem, setArtItem] = useState<ArtItem | null>(null);

  useEffect(() => {
    axios
      .get(`https://65f3f34a105614e654a18199.mockapi.io/art/${id}`)
      .then((response) => setArtItem(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  if (!artItem) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Tên: {artItem.artName}</Text>
      <Text>Giá: {artItem.price}$</Text>
      <Text>Mô tả: {artItem.description}</Text>
    </View>
  );
}
