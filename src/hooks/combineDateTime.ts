export function combineDateTime(
  date?: Date,
  time?: string
): string | null {
  if (!date || !time) return null;

  const [hour, minute] = time.split(":");

  const combined = new Date(date);
  combined.setHours(
    Number(hour),
    Number(minute),
    0,
    0
  );

  return combined.toISOString();
}
