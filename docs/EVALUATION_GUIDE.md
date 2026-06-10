# Evaluation Guide

## 주요 파일 역할

- `app/(tabs)/index.tsx`: 홈 피드 화면입니다. `loadFeed()` 결과로 받은 마음과 보낸 마음을 보여줍니다.
- `app/(tabs)/send.tsx`: 친구 검색, 친구 선택, 메시지 입력, 전송 버튼 처리를 담당합니다.
- `app/signal/[id].tsx`: 신호 ID로 상세 데이터를 불러와 메시지와 힌트를 보여줍니다.
- `app/(tabs)/settings.tsx`: 정상, 빈 응답, 오류 API 모드를 바꿔 예외 처리를 확인합니다.
- `api/demo-api.ts`: 공개용 fake API입니다. 실제 서버 대신 지연, 성공, 실패, 빈 응답을 반환합니다.
- `store/use-app-store.ts`: Zustand Store입니다. 홈 피드, 토큰 수, API 모드, 로딩/에러 상태를 관리합니다.
- `hooks/use-schoolmates.ts`: 보내기 화면의 친구 목록 요청 상태를 관리합니다.
- `hooks/use-signal-detail.ts`: 상세 화면의 로딩, 에러, 없는 데이터 상태를 관리합니다.

## 버튼 클릭 후 실행 흐름

- 홈 새로고침 버튼: `app/(tabs)/index.tsx` -> `loadFeed()` -> `getHomeFeed()` -> Store 갱신
- 보내기 버튼: `app/(tabs)/send.tsx` -> `handleSubmit()` -> `sendSignal()` -> `createSignal()` -> 성공 화면 이동
- 상세 보기 버튼: `app/sent-success.tsx` -> `/signal/[id]` 이동 -> `useSignalDetail()` -> `getSignalDetail()`
- API 모드 버튼: `app/(tabs)/settings.tsx` -> `setDemoMode()` -> `loadFeed()` 재호출
- 데이터 초기화 버튼: `resetDemo()` -> `resetDemoDatabase()` -> Store 초기화

## 템플릿 및 예외 시나리오

- 템플릿 메시지를 눌러 입력한 뒤, 친구를 변경해도 템플릿 내용은 남아 있는지 확인합니다.
- 친구가 선택되지 않은 상태에서 전송 시도 시 경고 대화상자가 표시되는지 확인합니다.
- 오류 모드일 때 전송/친구 검색/상세 조회가 모두 Error 상태로 대체되는지 확인합니다.

## 상태값 위치

- `demoMode`: 설정 화면에서 변경, API 레이어가 성공/빈 응답/오류를 결정할 때 사용
- `receivedSignals`, `sentSignals`: 홈 화면과 상세 진입의 기준 데이터
- `tokenBalance`: 홈과 보내기 화면에서 공유
- `loadStatus`, `loadError`: 홈 피드 로딩과 실패 표시
- `sendStatus`, `sendError`: 전송 버튼 로딩과 전송 실패 표시

## 안정성 체크 방법

1. 설정 탭에서 `오류`를 선택하고 홈으로 이동하면 Error State와 다시 시도 버튼이 표시됩니다.
2. 설정 탭에서 `빈 응답`을 선택하면 홈과 친구 목록에서 Empty State가 표시됩니다.
3. 보내기 탭에서 친구를 선택하지 않고 제출하면 Alert가 표시됩니다.
4. 메시지를 3자 미만으로 입력하면 입력 필드 아래에 검증 오류가 표시됩니다.
5. 존재하지 않는 `/signal/wrong-id`로 이동하면 신호 없음 상태가 표시됩니다.

## Git 기록 안내

Git 평가 항목은 실제 개발 기록을 확인하는 항목입니다. 공개용 저장소를 제출한다면 이 폴더를 한 번에 올린 것처럼 보이게 조작하지 말고, 실제 작업 순서대로 커밋하세요.

예시:

```text
feat: scaffold public expo demo
feat: add demo api and app store
feat: implement signal send flow
fix: handle empty and api error states
docs: add public data flow guide
```
