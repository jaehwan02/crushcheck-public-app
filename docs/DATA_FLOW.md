# Data Flow

## 1. 홈 피드 조회

1. 사용자 행동: 앱 실행 또는 홈 화면에서 새로고침
2. 화면 이동: `app/(tabs)/index.tsx` 유지
3. 상태 변화: `useAppStore.loadFeed()`가 `loadStatus`를 `loading`으로 변경
4. API 호출: `api/demo-api.ts`의 `getHomeFeed(demoMode)` 호출
5. 저장 위치: 응답의 `receivedSignals`, `sentSignals`, `tokenBalance`를 `store/use-app-store.ts`에 저장
6. 성공 처리: 홈 화면이 받은 마음과 보낸 마음 목록을 렌더링
7. 빈 응답 처리: 설정에서 `empty` 모드일 때 Empty State 표시
8. 실패 처리: 설정에서 `error` 모드일 때 Error State와 다시 시도 버튼 표시

## 2. 마음 보내기

1. 사용자 행동: 보내기 탭에서 친구 검색, 친구 선택, 메시지 입력, 보내기 버튼 클릭
2. 화면 이동: `app/(tabs)/send.tsx`에서 성공 시 `app/sent-success.tsx`로 이동
3. 상태 변화: `sendStatus`가 `loading`으로 바뀌고, 성공 시 `lastCreatedSignalId`와 `tokenBalance` 갱신
4. API 호출: `useAppStore.sendSignal()`이 `createSignal(input, demoMode)` 호출
5. 저장 위치: 새 신호는 데모 API의 메모리 DB에 추가되고, 이후 `loadFeed()`로 Zustand Store에 반영
6. 실패 처리: 친구 미선택, 메시지 3자 미만, 토큰 부족, API 오류를 각각 안내

## 3. 신호 상세 확인

1. 사용자 행동: 홈 목록 또는 전송 완료 화면에서 신호 카드 클릭
2. 화면 이동: `/signal/[id]` 동적 라우트로 이동
3. 상태 변화: `useSignalDetail(id)` 훅이 `status`를 `loading`, `success`, `error` 중 하나로 관리
4. API 호출: `getSignalDetail(id, demoMode)` 호출
5. 저장 위치: 상세 화면의 로컬 state에 `signal` 저장
6. 실패 처리: API 오류면 Error State, 없는 ID면 Empty State 표시

## 설계 판단

- 전역 Store에는 여러 화면에서 공유하는 `tokenBalance`, 홈 피드 목록, API 모드, 전송 상태를 둡니다.
- 상세 화면의 `signal`은 해당 화면에서만 필요하므로 로컬 훅 state로 관리합니다.
- 외부 API 대신 데모 API를 선택한 이유는 공개용 코드에서 서버 주소, 인증, 내부 정책을 숨기면서도 로딩, 성공, 빈 응답, 실패 흐름을 실제처럼 설명하기 위해서입니다.
- API 실패 상황은 설정 화면에서 강제로 재현할 수 있게 만들어 평가자가 예외 처리를 확인할 수 있습니다.
