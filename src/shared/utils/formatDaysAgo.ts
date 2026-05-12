const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function formatDaysAgo(
  value: string | null | undefined,
  now: Date = new Date(),
): string {
  if (!value?.trim()) {
    return "-";
  }

  const target = new Date(value);
  if (Number.isNaN(target.getTime())) {
    return "-";
  }

  const diffMs = Math.max(0, now.getTime() - target.getTime());
  const diffDays = Math.floor(diffMs / DAY_IN_MS);

  return `${diffDays}일 전`;
}

export function formatDaysAgoTwo(
  value: string | null | undefined,
  now: Date = new Date(),
): string {
  if (!value?.trim()) {
    return "-";
  }

  const target = new Date(value);
  if (Number.isNaN(target.getTime())) {
    return "-";
  }

  const diffMs = Math.max(0, now.getTime() - target.getTime());
  const diffDays = Math.floor(diffMs / DAY_IN_MS);

  return `${diffDays}`;
}
