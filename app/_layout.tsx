import { Stack, router } from "expo-router";
import { Button } from "react-native";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="detail/[id]"
        options={{
          title: "Chi tiết sản phẩm",
          headerShown: true,
          headerLeft: () => (
            <Button title="Trang Chủ" onPress={() => router.push("/home")} />
          ),
        }}
      />
    </Stack>
  );
}
