const TIME_ZONE = process.env.DISPLAY_TIMEZONE || "Asia/Kolkata";

const dateTime = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: TIME_ZONE,
});

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  return dateTime.format(typeof value === "string" ? new Date(value) : value);
}
