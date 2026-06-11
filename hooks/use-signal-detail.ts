import { useCallback, useEffect, useState } from "react";

import { getSignalDetail, isDemoApiError } from "@/api/demo-api";
import { useAppStore } from "@/store/use-app-store";
import type { LoadStatus, Signal } from "@/types/demo";

function toMessage(error: unknown): string {
  if (isDemoApiError(error)) {
    return error.message;
  }

  return "신호 상세를 불러오지 못했습니다.";
}

export function useSignalDetail(id: string | undefined) {
  const demoMode = useAppStore((state) => state.demoMode);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [signal, setSignal] = useState<Signal | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setStatus("error");
      setError("잘못된 신호 주소입니다.");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const result = await getSignalDetail(id, demoMode);
      setSignal(result);
      setStatus("success");
    } catch (detailError) {
      setSignal(null);
      setError(toMessage(detailError));
      setStatus("error");
    }
  }, [demoMode, id]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    signal,
    status,
    error,
    reload: load
  };
}
