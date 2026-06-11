import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { theme } from "@/constants/theme";

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  name,
  color,
  size
}: {
  name: IconName;
  color: string;
  size: number;
}) {
  return <Ionicons name={name} color={color} size={size} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.color.primary,
        tabBarInactiveTintColor: theme.color.muted,
        tabBarStyle: {
          minHeight: 62,
          paddingTop: 6,
          borderTopColor: theme.color.border,
          backgroundColor: theme.color.bg
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => <TabIcon name="home-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          title: "보내기",
          tabBarIcon: ({ color, size }) => <TabIcon name="paper-plane-outline" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: ({ color, size }) => <TabIcon name="settings-outline" color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
