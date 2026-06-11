import { useCallback, useEffect, useState } from "react";

import { getSchoolmates, isDemoApiError } from "@/api/demo-api";
import { useAppStore } from "@/store/use-app-store";
import type { LoadStatus, Schoolmate } from "@/types/demo";

function toMessage(error: unknown): string {
  if (isDemoApiError(error)) {
    return error.message;
  }

  return "친구 목록을 불러오지 못했습니다.";
}

export function useSchoolmates(searchText: string) {
  const demoMode = useAppStore((state) => state.demoMode);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [schoolmates, setSchoolmates] = useState<Schoolmate[]>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const result = await getSchoolmates(demoMode, searchText);
      setSchoolmates(result);
      setStatus("success");
    } catch (loadError) {
      setSchoolmates([]);
      setError(toMessage(loadError));
      setStatus("error");
    }
  }, [demoMode, searchText]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void load();
    }, 180);

    return () => clearTimeout(timeoutId);
  }, [load]);

  return {
    schoolmates,
    status,
    error,
    reload: load
  };
}
