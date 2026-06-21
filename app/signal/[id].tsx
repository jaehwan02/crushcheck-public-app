import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { ScreenContainer } from "@/components/screen-container";
import { StateView } from "@/components/state-view";
import { theme } from "@/constants/theme";
import { useSignalDetail } from "@/hooks/use-signal-detail";

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(iso));
}

function signalStatusLabel(status: "active" | "matched" | "expired"): string {
  if (status === "active") {
    return "응답 대기중";
  }

  if (status === "matched") {
    return "매칭 완료";
  }

  return "만료됨";
}

export default function SignalDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { signal, status, error, reload } = useSignalDetail(id);

  return (
    <ScreenContainer title="신호 상세" subtitle="선택한 마음의 상태와 힌트를 확인합니다.">
      <Stack.Screen options={{ title: signal?.targetName ?? "신호 상세" }} />

      {status === "loading" ? <StateView title="상세 정보를 불러오는 중" loading /> : null}

      {status === "error" ? (
        <StateView
          title="상세 정보를 불러오지 못했습니다"
          message={error ?? undefined}
          actionLabel="다시 시도"
          onAction={reload}
        />
      ) : null}

      {status === "success" && !signal ? (
        <StateView
          title="신호를 찾을 수 없습니다"
          message="삭제되었거나 만료된 신호일 수 있습니다."
          actionLabel="다시 확인"
          onAction={reload}
        />
      ) : null}

      {signal ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.color.border,
            borderRadius: theme.radius.sm,
            backgroundColor: theme.color.surface,
            padding: 16,
            gap: 14
          }}
        >
          <View style={{ gap: 4 }}>
            <AppText variant="title">{signal.targetName}</AppText>
            <AppText tone="muted">@{signal.targetHandle}</AppText>
          </View>

          <View style={{ gap: 6 }}>
            <AppText variant="caption" tone="muted">
              메시지
            </AppText>
            <AppText selectable>{signal.message}</AppText>
          </View>

          <View style={{ gap: 6 }}>
            <AppText variant="caption" tone="muted">
              힌트
            </AppText>
            <AppText selectable>{signal.hint ?? "아직 공개된 힌트가 없습니다."}</AppText>
          </View>

          <View style={{ gap: 6 }}>
            <AppText variant="caption" tone="muted">
              상태
            </AppText>
            <AppText tone={signal.status === "matched" ? "success" : "info"}>
              {signalStatusLabel(signal.status)}
            </AppText>
          </View>

          <AppText variant="caption" tone="muted">
            생성 {formatDateTime(signal.createdAt)} - 만료 {formatDateTime(signal.expiresAt)}
          </AppText>
        </View>
      ) : null}
    </ScreenContainer>
  );
}
