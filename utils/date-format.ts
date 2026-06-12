export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric"
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(iso));
}

export function daysUntil(isoDate: string): number {
  const diffMs = new Date(isoDate).getTime() - Date.now();

  return Math.max(0, Math.ceil(diffMs / 86400000));
}
