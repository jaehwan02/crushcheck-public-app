import { Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/constants/theme";
import type { Schoolmate } from "@/types/demo";

type Props = {
  item: Schoolmate;
  selected: boolean;
  onPress: () => void;
};

export function SchoolmateRow({ item, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 64,
        borderWidth: 1,
        borderColor: selected ? theme.color.primary : theme.color.border,
        borderRadius: theme.radius.sm,
        backgroundColor: pressed || selected ? theme.color.surfaceRaised : theme.color.surface,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14
      })}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <AppText variant="subtitle">{item.displayName}</AppText>
        <AppText tone="muted">
          @{item.handle} - {item.className}
        </AppText>
      </View>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: selected ? theme.color.primary : theme.color.dim,
          backgroundColor: selected ? theme.color.primary : "transparent"
        }}
      />
    </Pressable>
  );
}
