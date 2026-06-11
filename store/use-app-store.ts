import { create } from "zustand";

import {
  createSignal,
  getHomeFeed,
  isDemoApiError,
  resetDemoDatabase
} from "@/api/demo-api";
import { demoProfile } from "@/data/demo-seed";
import type {
  ApiMode,
  DemoProfile,
  LoadStatus,
  SendSignalInput,
  Signal
} from "@/types/demo";

type AppState = {
  demoMode: ApiMode;
  profile: DemoProfile;
  receivedSignals: Signal[];
  sentSignals: Signal[];
  tokenBalance: number;
  loadStatus: LoadStatus;
  loadError: string | null;
  sendStatus: LoadStatus;
  sendError: string | null;
  lastCreatedSignalId: string | null;
  setDemoMode: (mode: ApiMode) => void;
  loadFeed: () => Promise<void>;
  sendSignal: (input: SendSignalInput) => Promise<Signal>;
  resetDemo: () => Promise<void>;
};

function toMessage(error: unknown): string {
  if (isDemoApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
}

export const useAppStore = create<AppState>((set, get) => ({
  demoMode: "normal",
  profile: demoProfile,
  receivedSignals: [],
  sentSignals: [],
  tokenBalance: 0,
  loadStatus: "idle",
  loadError: null,
  sendStatus: "idle",
  sendError: null,
  lastCreatedSignalId: null,

  setDemoMode: (mode) => {
    set({ demoMode: mode, loadError: null, sendError: null });
    void get().loadFeed();
  },

  loadFeed: async () => {
    set({ loadStatus: "loading", loadError: null });

    try {
      const feed = await getHomeFeed(get().demoMode);
      set({
        receivedSignals: feed.receivedSignals,
        sentSignals: feed.sentSignals,
        tokenBalance: feed.tokenBalance,
        loadStatus: "success"
      });
    } catch (error) {
      set({
        receivedSignals: [],
        sentSignals: [],
        loadStatus: "error",
        loadError: toMessage(error)
      });
    }
  },

  sendSignal: async (input) => {
    set({ sendStatus: "loading", sendError: null });

    try {
      const result = await createSignal(input, get().demoMode);
      set({
        tokenBalance: result.tokenBalance,
        sendStatus: "success",
        lastCreatedSignalId: result.signal.id
      });
      await get().loadFeed();
      return result.signal;
    } catch (error) {
      const message = toMessage(error);
      set({ sendStatus: "error", sendError: message });
      throw new Error(message);
    }
  },

  resetDemo: async () => {
    set({ loadStatus: "loading", loadError: null, sendError: null });
    const feed = await resetDemoDatabase();
    set({
      demoMode: "normal",
      receivedSignals: feed.receivedSignals,
      sentSignals: feed.sentSignals,
      tokenBalance: feed.tokenBalance,
      loadStatus: "success",
      lastCreatedSignalId: null
    });
  }
}));
