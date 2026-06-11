import {
  ActivityIndicator,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle
} from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/constants/theme";

type Props = PressableProps & {
  label: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary" | "danger";
};

export function PrimaryButton({
  label,
  loading = false,
  variant = "primary",
  disabled,
  style,
  ...props
}: Props) {
  const isDisabled = disabled || loading;
  const backgroundColor =
    variant === "primary"
      ? theme.color.primary
      : variant === "danger"
        ? theme.color.danger
        : theme.color.surfaceRaised;
  const textColor = variant === "primary" ? theme.color.primaryText : theme.color.text;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          minHeight: theme.spacing.touch,
          borderRadius: theme.radius.sm,
          backgroundColor,
          opacity: isDisabled ? 0.52 : pressed ? 0.82 : 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingVertical: 12
        },
        style
      ]}
    >
      <View style={{ minHeight: 20, alignItems: "center", justifyContent: "center" }}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <AppText style={{ color: textColor, fontWeight: "700" }}>{label}</AppText>
        )}
      </View>
    </Pressable>
  );
}
