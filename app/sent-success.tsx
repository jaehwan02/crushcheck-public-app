import { Link, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { PrimaryButton } from "@/components/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { theme } from "@/constants/theme";

export default function SentSuccessScreen() {
  const params = useLocalSearchParams<{ signalId?: string }>();
  const signalId = Array.isArray(params.signalId) ? params.signalId[0] : params.signalId;

  return (
    <ScreenContainer title="전송 완료" subtitle="마음이 홈 화면의 보낸 마음 목록에 추가되었습니다.">
      <View
        style={{
          borderWidth: 1,
          borderColor: theme.color.border,
          borderRadius: theme.radius.sm,
          backgroundColor: theme.color.surface,
          padding: 16,
          gap: 10
        }}
      >
        <AppText variant="subtitle">신호가 생성되었습니다</AppText>
        <AppText tone="muted">
          전송 API 응답으로 받은 신호 ID를 상세 화면 이동에 사용합니다.
        </AppText>
        {signalId ? (
          <AppText variant="caption" tone="muted" selectable>
            signalId: {signalId}
          </AppText>
        ) : null}
      </View>

      {signalId ? (
        <Link href={`/signal/${signalId}`} asChild>
          <PrimaryButton label="상세 보기" />
        </Link>
      ) : null}

      <Link href="/(tabs)" asChild>
        <PrimaryButton label="홈으로 이동" variant="secondary" />
      </Link>
    </ScreenContainer>
  );
}
