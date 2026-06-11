import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { PrimaryButton } from "@/components/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { theme } from "@/constants/theme";
import { useAppStore } from "@/store/use-app-store";
import type { ApiMode } from "@/types/demo";

const modes: Array<{ value: ApiMode; label: string; description: string }> = [
  {
    value: "normal",
    label: "정상",
    description: "목록, 상세, 전송이 모두 성공합니다."
  },
  {
    value: "empty",
    label: "빈 응답",
    description: "피드와 친구 목록이 비어 있는 상태를 확인합니다."
  },
  {
    value: "error",
    label: "오류",
    description: "API 실패 시 안내와 재시도 버튼을 확인합니다."
  }
];

export default function SettingsScreen() {
  const demoMode = useAppStore((state) => state.demoMode);
  const setDemoMode = useAppStore((state) => state.setDemoMode);
  const resetDemo = useAppStore((state) => state.resetDemo);
  const loadStatus = useAppStore((state) => state.loadStatus);

  return (
    <ScreenContainer
      title="공개 데모 설정"
      subtitle="평가 중 예외 처리 흐름을 직접 확인할 수 있습니다."
    >
      <View style={{ gap: 10 }}>
        <AppText variant="subtitle">API 응답 모드</AppText>
        {modes.map((mode) => {
          const selected = demoMode === mode.value;

          return (
            <PrimaryButton
              key={mode.value}
              label={mode.label}
              variant={selected ? "primary" : "secondary"}
              onPress={() => setDemoMode(mode.value)}
            />
          );
        })}
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: theme.color.border,
          borderRadius: theme.radius.sm,
          backgroundColor: theme.color.surface,
          padding: 14,
          gap: 8
        }}
      >
        <AppText variant="subtitle">현재 모드</AppText>
        <AppText tone="muted">
          {modes.find((mode) => mode.value === demoMode)?.description}
        </AppText>
      </View>

      <PrimaryButton
        label="데모 데이터 초기화"
        variant="secondary"
        loading={loadStatus === "loading"}
        onPress={() => {
          void resetDemo();
        }}
      />
    </ScreenContainer>
  );
}
