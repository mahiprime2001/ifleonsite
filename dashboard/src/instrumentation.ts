/*
 * Runs once when the server starts. Starts the background job that empties expired trash
 * (items deleted more than 30 days ago), shortly after boot and then every 6 hours.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // `next build` also loads this file; the job only belongs in a running server.
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { purgeExpiredTrash } = await import("./lib/trash");
  const run = async () => {
    try {
      const removed = await purgeExpiredTrash();
      if (removed > 0) console.log(`[trash] permanently deleted ${removed} expired item(s)`);
    } catch (error) {
      // The database may not be up yet on first boot; the next run will try again.
      console.error("[trash] purge failed:", error instanceof Error ? error.message : error);
    }
  };

  setTimeout(run, 60_000).unref();
  setInterval(run, 6 * 60 * 60 * 1000).unref();

  // Pick up an AI autopilot job that was running before this restart (after the DB is surely up).
  setTimeout(async () => {
    try {
      const { resumeAutopilot } = await import("./lib/ai/autopilot");
      await resumeAutopilot();
    } catch (error) {
      console.error("[autopilot] resume failed:", error instanceof Error ? error.message : error);
    }
  }, 15_000).unref();
}
