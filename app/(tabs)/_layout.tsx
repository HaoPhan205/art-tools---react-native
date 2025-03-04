import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { SearchProvider, useSearch } from "~/components/SearchContext";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SearchProvider>
        <Tabs
          screenOptions={{
            headerStyle: { backgroundColor: "#f8f8f8", height: 150 },
            headerTitleAlign: "center",
            headerTitleContainerStyle: { width: "100%" },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              tabBarLabel: "Trang chủ",
              headerTitle: () => <HeaderComponent title="Trang chủ" />,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="favourites"
            options={{
              tabBarLabel: "Yêu thích",
              headerTitle: () => (
                <HeaderComponent title="Danh sách yêu thích" />
              ),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart-outline" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </SearchProvider>
    </GestureHandlerRootView>
  );
}

const HeaderComponent = ({ title }: { title: string }) => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" style={styles.icon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
  },
  filterButton: {
    marginLeft: 8,
    padding: 10,
  },
});
