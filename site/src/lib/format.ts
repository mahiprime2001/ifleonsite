/*
 * Dates shown on the site, always in India time, so the server and the browser print the same
 * text (otherwise hydration fails for posts published near midnight).
 */
const long = new Intl.DateTimeFormat("en-US", { month: "long", day: "2-digit", year: "numeric", timeZone: "Asia/Kolkata" });
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "Asia/Kolkata" });

/* "October 31, 2026" */
export const formatLongDate = (iso: string) => long.format(new Date(iso));
/* "Oct 31, 2026" */
export const formatShortDate = (iso: string) => short.format(new Date(iso));
