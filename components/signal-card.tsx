import { Link } from "expo-router";
import { Pressable, View } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/constants/theme";
import type { Signal } from "@/types/demo";

type Props = {
  signal: Signal;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric"
  }).format(new Date(iso));
}

export function SignalCard({ signal }: Props) {
  const badgeLabel = signal.role === "receiver" ? "받은 마음" : "보낸 마음";
  const badgeColor = signal.role === "receiver" ? theme.color.info : theme.color.primary;

  return (
    <Link href={`/signal/${signal.id}`} asChild>
      <Pressable
        style={({ pressed }) => ({
          borderWidth: 1,
          borderColor: theme.color.border,
          borderRadius: theme.radius.sm,
          backgroundColor: pressed ? theme.color.surfaceRaised : theme.color.surface,
          padding: 14,
          gap: 10
        })}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="subtitle" numberOfLines={1}>
              {signal.targetName}
            </AppText>
            <AppText tone="muted" numberOfLines={1}>
              @{signal.targetHandle}
            </AppText>
          </View>
          <View
            style={{
              minHeight: 28,
              borderRadius: theme.radius.pill,
              backgroundColor: badgeColor,
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <AppText variant="caption" style={{ color: theme.color.primaryText, fontWeight: "700" }}>
              {badgeLabel}
            </AppText>
          </View>
        </View>
        <AppText numberOfLines={2}>{signal.message}</AppText>
        <AppText variant="caption" tone="muted">
          {formatDate(signal.createdAt)} 생성 - {formatDate(signal.expiresAt)} 만료
        </AppText>
      </Pressable>
    </Link>
  );
}
