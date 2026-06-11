import { Text, type TextProps } from "react-native";

import { theme } from "@/constants/theme";

type Props = TextProps & {
  variant?: "title" | "subtitle" | "body" | "caption";
  tone?: "default" | "muted" | "danger" | "success" | "info";
};

const sizes = {
  title: 28,
  subtitle: 18,
  body: 15,
  caption: 12
} as const;

const lineHeights = {
  title: 34,
  subtitle: 24,
  body: 21,
  caption: 17
} as const;

const colors = {
  default: theme.color.text,
  muted: theme.color.muted,
  danger: theme.color.danger,
  success: theme.color.success,
  info: theme.color.info
} as const;

export function AppText({
  variant = "body",
  tone = "default",
  style,
  ...props
}: Props) {
  return (
    <Text
      {...props}
      style={[
        {
          color: colors[tone],
          fontSize: sizes[variant],
          lineHeight: lineHeights[variant],
          letterSpacing: 0,
          fontWeight: variant === "title" || variant === "subtitle" ? "700" : "400"
        },
        style
      ]}
    />
  );
}
