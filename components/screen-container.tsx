import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/app-text";
import { theme } from "@/constants/theme";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function ScreenContainer({
  title,
  subtitle,
  children,
  refreshing = false,
  onRefresh
}: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.bg }} edges={["top"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.color.text} />
          ) : undefined
        }
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screenX,
          paddingTop: 18,
          paddingBottom: 120,
          gap: 18
        }}
      >
        <View style={{ gap: 6 }}>
          <AppText variant="title">{title}</AppText>
          {subtitle ? (
            <AppText variant="body" tone="muted">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
