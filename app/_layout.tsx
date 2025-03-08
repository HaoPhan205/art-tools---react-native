import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerStyle: { backgroundColor: "#6ec2f7" },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="detail/[id]"
        options={{
          title: "Chi tiết sản phẩm",
          headerShown: true,
          headerStyle: { backgroundColor: "#6ec2f7" },
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                Chi tiết sản phẩm
              </Text>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
