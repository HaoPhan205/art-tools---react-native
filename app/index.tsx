import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>WELCOME TO MY APP</Text>
      <Button
        title="Đi đến trang chủ"
        onPress={() => router.push("/home")}
      ></Button>
    </View>
  );
}
