export type ApiMode = "normal" | "empty" | "error";

export type LoadStatus = "idle" | "loading" | "success" | "error";

export type DemoProfile = {
  id: string;
  displayName: string;
  schoolName: string;
  grade: number;
};

export type Schoolmate = {
  id: string;
  displayName: string;
  handle: string;
  className: string;
};

export type SignalRole = "sender" | "receiver";

export type SignalStatus = "active" | "matched" | "expired";

export type Signal = {
  id: string;
  role: SignalRole;
  targetName: string;
  targetHandle: string;
  message: string;
  hint: string | null;
  status: SignalStatus;
  createdAt: string;
  expiresAt: string;
};

export type HomeFeed = {
  receivedSignals: Signal[];
  sentSignals: Signal[];
  tokenBalance: number;
};

export type SendSignalInput = {
  targetId: string;
  message: string;
};

export type CreateSignalResponse = {
  signal: Signal;
  tokenBalance: number;
};
