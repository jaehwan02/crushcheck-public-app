import { ActivityIndicator, View } from "react-native";

import { AppText } from "@/components/app-text";
import { PrimaryButton } from "@/components/primary-button";
import { theme } from "@/constants/theme";

type Props = {
  title: string;
  message?: string;
  actionLabel?: string;
  loading?: boolean;
  onAction?: () => void;
};

export function StateView({
  title,
  message,
  actionLabel,
  loading = false,
  onAction
}: Props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.color.border,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.color.surface,
        padding: 18,
        gap: 12,
        alignItems: "flex-start"
      }}
    >
      {loading ? <ActivityIndicator color={theme.color.primary} /> : null}
      <AppText variant="subtitle">{title}</AppText>
      {message ? (
        <AppText tone="muted" selectable>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} variant="secondary" onPress={onAction} />
      ) : null}
    </View>
  );
}
