import { createInitialFeed, demoSchoolmates } from "@/data/demo-seed";
import type {
  ApiMode,
  CreateSignalResponse,
  HomeFeed,
  Schoolmate,
  SendSignalInput,
  Signal
} from "@/types/demo";

type DemoDatabase = HomeFeed;

export class DemoApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "DemoApiError";
    this.code = code;
  }
}

let demoDb: DemoDatabase = createInitialFeed();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function wait(ms = 450): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureApiAvailable(mode: ApiMode): void {
  if (mode === "error") {
    throw new DemoApiError(
      "DEMO_NETWORK_ERROR",
      "데모 API 연결에 실패했습니다. 설정에서 정상 모드로 바꾼 뒤 다시 시도해주세요."
    );
  }
}

function emptyFeed(): HomeFeed {
  return {
    receivedSignals: [],
    sentSignals: [],
    tokenBalance: demoDb.tokenBalance
  };
}

export function isDemoApiError(error: unknown): error is DemoApiError {
  return error instanceof DemoApiError;
}

export async function getHomeFeed(mode: ApiMode): Promise<HomeFeed> {
  await wait();
  ensureApiAvailable(mode);

  if (mode === "empty") {
    return emptyFeed();
  }

  return clone(demoDb);
}

export async function getSchoolmates(
  mode: ApiMode,
  searchText = ""
): Promise<Schoolmate[]> {
  await wait(320);
  ensureApiAvailable(mode);

  if (mode === "empty") {
    return [];
  }

  const normalized = searchText.trim().toLowerCase();
  const result = normalized
    ? demoSchoolmates.filter((user) => {
        return (
          user.displayName.toLowerCase().includes(normalized) ||
          user.handle.toLowerCase().includes(normalized)
        );
      })
    : demoSchoolmates;

  return clone(result);
}

export async function createSignal(
  input: SendSignalInput,
  mode: ApiMode
): Promise<CreateSignalResponse> {
  await wait(520);
  ensureApiAvailable(mode);

  const message = input.message.trim();
  const target = demoSchoolmates.find((user) => user.id === input.targetId);

  if (!target) {
    throw new DemoApiError("TARGET_NOT_FOUND", "선택한 친구를 찾을 수 없습니다.");
  }

  if (message.length < 3) {
    throw new DemoApiError(
      "INVALID_MESSAGE",
      "마음 메시지는 3자 이상 입력해주세요."
    );
  }

  if (demoDb.tokenBalance <= 0) {
    throw new DemoApiError(
      "INSUFFICIENT_TOKEN",
      "남은 토큰이 없습니다. 공개 데모에서는 설정에서 데이터를 초기화할 수 있습니다."
    );
  }

  const now = new Date();
  const signal: Signal = {
    id: `sent_${now.getTime()}`,
    role: "sender",
    targetName: target.displayName,
    targetHandle: target.handle,
    message,
    hint: "상대가 답장을 보내면 매치 상태로 바뀝니다.",
    status: "active",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  demoDb = {
    ...demoDb,
    tokenBalance: demoDb.tokenBalance - 1,
    sentSignals: [signal, ...demoDb.sentSignals]
  };

  return {
    signal: clone(signal),
    tokenBalance: demoDb.tokenBalance
  };
}

export async function getSignalDetail(
  id: string,
  mode: ApiMode
): Promise<Signal | null> {
  await wait(280);
  ensureApiAvailable(mode);

  if (mode === "empty") {
    return null;
  }

  const signal = [...demoDb.receivedSignals, ...demoDb.sentSignals].find(
    (item) => item.id === id
  );

  return signal ? clone(signal) : null;
}

export async function resetDemoDatabase(): Promise<HomeFeed> {
  await wait(260);
  demoDb = createInitialFeed();
  return clone(demoDb);
}
