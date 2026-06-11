import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { theme } from "@/constants/theme";
import { useAppStore } from "@/store/use-app-store";

export default function RootLayout() {
  const loadFeed = useAppStore((state) => state.loadFeed);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.color.bg }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.color.bg },
          headerTintColor: theme.color.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: theme.color.bg }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signal/[id]" options={{ title: "신호 상세" }} />
        <Stack.Screen name="sent-success" options={{ title: "전송 완료" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
