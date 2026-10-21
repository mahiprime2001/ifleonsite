/* True for a Postgres unique-constraint violation (code 23505), whether or not Drizzle wrapped it. */
export function isUniqueViolation(error: unknown) {
  const candidates = [error, (error as { cause?: unknown })?.cause];
  return candidates.some((e) => (e as { code?: string })?.code === "23505");
}
