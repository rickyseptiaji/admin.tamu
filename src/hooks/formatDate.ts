 
export function formatDate(timestamp: any): string {
  if (!timestamp) return "-";

  let date: Date;

  // Firestore Timestamp (punya toDate)
  if (typeof timestamp === "object" && typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  }
  // Plain object { seconds, nanoseconds }
  else if (
    typeof timestamp === "object" &&
    "seconds" in timestamp &&
    "nanoseconds" in timestamp
  ) {
    date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1_000_000
    );
  }
  // Date | string | number
  else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return "-";

  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}
