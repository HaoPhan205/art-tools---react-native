import React, { useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { SearchProvider, useSearch } from "~/components/SearchContext";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { BrandProvider } from "~/components/BrandContext";
import { useNavigation } from "@react-navigation/native";
import BrandFilterDrawer from "~/components/BrandFilterDrawer";

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SearchProvider>
        <BrandProvider>
          <Drawer.Navigator
            screenOptions={{ drawerPosition: "right", headerShown: false }}
            drawerContent={(props) => <BrandFilterDrawer {...props} />}
          >
            <Drawer.Screen name="Tabs">
              {() => (
                <>
                  <Tabs
                    screenOptions={{
                      headerStyle: { backgroundColor: "#6ec2f7", height: 150 },
                      headerTitleAlign: "center",
                      headerTitleContainerStyle: { width: "100%" },
                    }}
                  >
                    <Tabs.Screen
                      name="home"
                      options={{
                        tabBarLabel: "Danh mục sản phẩm",
                        headerTitle: () => (
                          <HeaderComponent title="Mua sắm ngay" />
                        ),
                        tabBarIcon: ({ color, size }) => (
                          <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                          />
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
                          <Ionicons
                            name="heart-outline"
                            size={size}
                            color={color}
                          />
                        ),
                      }}
                    />
                  </Tabs>
                  <Toast />
                </>
              )}
            </Drawer.Screen>
          </Drawer.Navigator>
        </BrandProvider>
      </SearchProvider>
    </GestureHandlerRootView>
  );
}

const HeaderComponent = ({ title }: { title: string }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [inputText, setInputText] = useState(searchQuery);
  const inputRef = useRef<TextInput>(null);
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  const handleSearch = () => {
    setSearchQuery(inputText);
    console.log("Search for:", inputText);
    Keyboard.dismiss();
  };

  const refreshPage = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace("/home");
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={refreshPage}>
            <Animated.Text
              style={[
                styles.headerTitle,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              {title}
            </Animated.Text>
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => (navigation as any).openDrawer()}
            >
              <Ionicons name="filter-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Bạn tìm gì hôm nay..."
            value={inputText}
            onChangeText={setInputText}
            onFocus={() => inputRef.current?.focus()}
            onBlur={() => inputRef.current?.blur()}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    marginBottom: 15,
    marginLeft: -5,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    color: "white",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
  },
  filterButton: {
    marginLeft: 8,
    padding: 10,
  },
  searchButton: {
    padding: 10,
  },
});
