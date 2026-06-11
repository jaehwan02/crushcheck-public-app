import { View } from "react-native";

import { AppText } from "@/components/app-text";
import { PrimaryButton } from "@/components/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { SignalCard } from "@/components/signal-card";
import { StateView } from "@/components/state-view";
import { theme } from "@/constants/theme";
import { useAppStore } from "@/store/use-app-store";

export default function HomeScreen() {
  const profile = useAppStore((state) => state.profile);
  const tokenBalance = useAppStore((state) => state.tokenBalance);
  const receivedSignals = useAppStore((state) => state.receivedSignals);
  const sentSignals = useAppStore((state) => state.sentSignals);
  const loadStatus = useAppStore((state) => state.loadStatus);
  const loadError = useAppStore((state) => state.loadError);
  const loadFeed = useAppStore((state) => state.loadFeed);

  const isLoading = loadStatus === "loading";
  const isEmpty = receivedSignals.length === 0 && sentSignals.length === 0;

  return (
    <ScreenContainer
      title={`${profile.displayName}님의 CrushCheck`}
      subtitle={`${profile.schoolName} ${profile.grade}학년 - 남은 토큰 ${tokenBalance}개`}
      refreshing={isLoading}
      onRefresh={loadFeed}
    >
      <View
        style={{
          borderRadius: theme.radius.sm,
          backgroundColor: theme.color.surfaceRaised,
          borderWidth: 1,
          borderColor: theme.color.border,
          padding: 16,
          gap: 8
        }}
      >
        <AppText variant="subtitle">오늘의 상태</AppText>
        <AppText tone="muted">
          받은 마음 {receivedSignals.length}개, 보낸 마음 {sentSignals.length}개를 확인할 수 있습니다.
        </AppText>
      </View>

      {isLoading && receivedSignals.length === 0 && sentSignals.length === 0 ? (
        <StateView title="피드를 불러오는 중" message="데모 API 응답을 기다리고 있습니다." loading />
      ) : null}

      {loadStatus === "error" ? (
        <StateView
          title="피드를 불러오지 못했습니다"
          message={loadError ?? undefined}
          actionLabel="다시 시도"
          onAction={loadFeed}
        />
      ) : null}

      {loadStatus === "success" && isEmpty ? (
        <StateView
          title="아직 표시할 신호가 없습니다"
          message="보내기 탭에서 친구를 선택하고 마음을 보내면 홈 화면에 나타납니다."
          actionLabel="새로고침"
          onAction={loadFeed}
        />
      ) : null}

      {receivedSignals.length > 0 ? (
        <View style={{ gap: 10 }}>
          <AppText variant="subtitle">받은 마음</AppText>
          {receivedSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </View>
      ) : null}

      {sentSignals.length > 0 ? (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <AppText variant="subtitle">보낸 마음</AppText>
            <PrimaryButton label="새로고침" variant="secondary" onPress={loadFeed} />
          </View>
          {sentSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </View>
      ) : null}
    </ScreenContainer>
  );
}
