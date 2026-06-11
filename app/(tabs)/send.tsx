import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, View } from "react-native";

import { AppText } from "@/components/app-text";
import { FormField } from "@/components/form-field";
import { PrimaryButton } from "@/components/primary-button";
import { SchoolmateRow } from "@/components/schoolmate-row";
import { ScreenContainer } from "@/components/screen-container";
import { StateView } from "@/components/state-view";
import { demoMessageRules } from "@/constants/demo-rules";
import { useSchoolmates } from "@/hooks/use-schoolmates";
import { useAppStore } from "@/store/use-app-store";
import type { Schoolmate } from "@/types/demo";

export default function SendScreen() {
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Schoolmate | null>(null);
  const [lastUsedTemplateId, setLastUsedTemplateId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const tokenBalance = useAppStore((state) => state.tokenBalance);
  const sendSignal = useAppStore((state) => state.sendSignal);
  const sendStatus = useAppStore((state) => state.sendStatus);
  const sendError = useAppStore((state) => state.sendError);
  const { schoolmates, status, error, reload } = useSchoolmates(searchText);
  const typedMessageLength = message.length;
  const isMessageReady = message.trim().length > 0;
  const templates = [
    { id: "casual", label: "안부", text: "오늘 수업 어땠어?" },
    { id: "compliment", label: "칭찬", text: "발표할 때 멋있었어" },
    { id: "question", label: "안부질문", text: "카톡으로 안부 좀 물어봐도 될까?" }
  ];

  const applyTemplate = (templateId: string, content: string) => {
    setMessage(content);
    setLastUsedTemplateId(templateId);
    if (validationError) {
      setValidationError(null);
    }
  };

  const messageError = useMemo(() => {
    if (!validationError) {
      return null;
    }

    return validationError;
  }, [validationError]);

  const handleSubmit = async () => {
    const trimmedMessage = message.trim();

    if (!selected) {
      Alert.alert("친구 선택 필요", "마음을 보낼 친구를 먼저 선택해주세요.");
      return;
    }

    if (trimmedMessage.length < demoMessageRules.minLength) {
      setValidationError(`마음 메시지는 ${demoMessageRules.minLength}자 이상 입력해주세요.`);
      return;
    }

    if (tokenBalance <= 0) {
      Alert.alert("토큰 부족", "남은 토큰이 없습니다. 설정에서 데모 데이터를 초기화해주세요.");
      return;
    }

    setValidationError(null);

    try {
      const created = await sendSignal({
        targetId: selected.id,
        message: trimmedMessage
      });
      setMessage("");
      setSelected(null);
      router.push({
        pathname: "/sent-success",
        params: { signalId: created.id }
      });
    } catch (submitError) {
      const messageText =
        submitError instanceof Error ? submitError.message : "마음 전송에 실패했습니다.";
      Alert.alert("전송 실패", messageText);
    }
  };

  return (
    <ScreenContainer
      title="마음 보내기"
      subtitle={`검색 후 친구를 선택하세요. 남은 토큰 ${tokenBalance}개`}
      refreshing={status === "loading"}
      onRefresh={reload}
    >
      <FormField
        label="친구 검색"
        value={searchText}
        onChangeText={setSearchText}
        placeholder="이름 또는 아이디"
        returnKeyType="search"
      />

      {status === "loading" ? (
        <StateView title="친구 목록을 불러오는 중" loading />
      ) : null}

      {status === "error" ? (
        <StateView
          title="친구 목록 오류"
          message={error ?? undefined}
          actionLabel="다시 시도"
          onAction={reload}
        />
      ) : null}

      {status === "success" && schoolmates.length === 0 ? (
        <StateView
          title="검색 결과가 없습니다"
          message="다른 이름이나 아이디로 검색해보세요."
          actionLabel="목록 새로고침"
          onAction={reload}
        />
      ) : null}

      {schoolmates.length > 0 ? (
        <View style={{ gap: 10 }}>
          <AppText variant="subtitle">같은 학교 친구</AppText>
          {schoolmates.map((item) => (
            <SchoolmateRow
              key={item.id}
              item={item}
              selected={selected?.id === item.id}
              onPress={() => setSelected(item)}
            />
          ))}
        </View>
      ) : null}

      {selected ? (
        <View style={{ gap: 8 }}>
          <AppText tone="muted">현재 선택: {selected.displayName}</AppText>
          <PrimaryButton
            label="선택 해제"
            variant="secondary"
            onPress={() => setSelected(null)}
          />
        </View>
      ) : null}

      <FormField
        label="마음 메시지"
        value={message}
        onChangeText={(next) => {
          setMessage(next);
          if (validationError) {
            setValidationError(null);
          }
        }}
        placeholder="예: 발표하는 모습이 멋있었어"
        multiline
        maxLength={demoMessageRules.maxLength}
        error={messageError}
        style={{ minHeight: 92, textAlignVertical: "top" }}
      />
      <View style={{ gap: 10 }}>
        <AppText variant="caption" tone="muted">
          빠른 작성 템플릿
        </AppText>
        {lastUsedTemplateId ? <AppText tone="muted">최근 템플릿 사용됨</AppText> : null}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {templates.map((template) => (
            <PrimaryButton
              key={template}
              label={`${template.label}: ${template.text}`}
              variant="secondary"
              onPress={() => applyTemplate(template.id, template.text)}
            />
          ))}
        </View>
      </View>
      <View style={{ alignItems: "flex-end", marginTop: -4 }}>
        <AppText
          variant="caption"
          tone={typedMessageLength >= demoMessageRules.maxLength ? "danger" : "muted"}
        >
          {typedMessageLength}/{demoMessageRules.maxLength}
        </AppText>
      </View>

      {sendStatus === "error" && sendError ? (
        <AppText tone="danger" selectable>
          {sendError}
        </AppText>
      ) : null}

      <PrimaryButton
        label={selected ? `${selected.displayName}에게 보내기` : "친구를 선택해주세요"}
        loading={sendStatus === "loading"}
        disabled={!selected || !isMessageReady}
        onPress={handleSubmit}
      />
    </ScreenContainer>
  );
}
