import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useBrand } from "~/components/BrandContext";
import { Ionicons } from "@expo/vector-icons";

export default function BrandFilterDrawer({ navigation }: any) {
  const { brands, selectedBrand, setSelectedBrand } = useBrand();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn thương hiệu</Text>
      <FlatList
        data={brands}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.brandItem,
              selectedBrand === item && styles.selectedBrand,
            ]}
            onPress={() => {
              setSelectedBrand(item);
              navigation.closeDrawer();
            }}
          >
            <Text style={styles.brandText}>{item}</Text>
            {selectedBrand === item && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          setSelectedBrand(null);
          navigation.closeDrawer();
        }}
      >
        <Text style={styles.resetText}>Thiết lập lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 100,
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    margin: 5,
  },
  brandItem: {
    flex: 1,
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#d3d3d385",
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: {
    fontSize: 16,
    color: "#555",
  },
  selectedBrand: {
    backgroundColor: "#e0f7fa",
  },
  resetButton: {
    padding: 10,
    backgroundColor: "#FF5C5C",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 25,
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 20,
  },
});
