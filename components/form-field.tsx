import { TextInput, View, type TextInputProps } from "react-native";

import { AppText } from "@/components/app-text";
import { theme } from "@/constants/theme";

type Props = TextInputProps & {
  label: string;
  error?: string | null;
};

export function FormField({ label, error, style, ...props }: Props) {
  return (
    <View style={{ gap: 8 }}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <TextInput
        {...props}
        placeholderTextColor={theme.color.dim}
        style={[
          {
            minHeight: 48,
            borderWidth: 1,
            borderColor: error ? theme.color.danger : theme.color.border,
            borderRadius: theme.radius.sm,
            backgroundColor: theme.color.surface,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: theme.color.text,
            fontSize: 15,
            lineHeight: 21
          },
          style
        ]}
      />
      {error ? (
        <AppText variant="caption" tone="danger" selectable>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
