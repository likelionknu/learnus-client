interface DateTimeParts {
  day: number;
  hour24: number;
  minute: string;
  month: number;
  year: number;
}

function parseDateTimeParts(value: string): DateTimeParts | null {
  const normalized = value.trim();

  const parts = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/,
  );

  if (parts) {
    return {
      year: Number(parts[1]),
      month: Number(parts[2]),
      day: Number(parts[3]),
      hour24: Number(parts[4]),
      minute: parts[5],
    };
  }

  const fallbackDate = new Date(normalized);
  if (Number.isNaN(fallbackDate.getTime())) {
    return null;
  }

  return {
    year: fallbackDate.getFullYear(),
    month: fallbackDate.getMonth() + 1,
    day: fallbackDate.getDate(),
    hour24: fallbackDate.getHours(),
    minute: String(fallbackDate.getMinutes()).padStart(2, "0"),
  };
}

export function formatKoreanDateTime12(value: string): string {
  const parsed = parseDateTimeParts(value);
  if (!parsed) {
    return value;
  }

  const period = parsed.hour24 < 12 ? "오전" : "오후";
  const hour12 = parsed.hour24 % 12 === 0 ? 12 : parsed.hour24 % 12;

  return `${parsed.year}년 ${parsed.month}월 ${parsed.day}일 ${period} ${hour12}시 ${parsed.minute}분`;
}

export function formatKoreanDateTime24(value: string): string {
  const parsed = parseDateTimeParts(value);
  if (!parsed) {
    return value;
  }

  const hour = String(parsed.hour24).padStart(2, "0");
  return `${parsed.year}년 ${parsed.month}월 ${parsed.day}일 ${hour}시 ${parsed.minute}분`;
}

export function formatKoreanDateTime(value: string): string {
  return formatKoreanDateTime12(value);
}
