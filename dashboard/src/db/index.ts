import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/*
 * postgres.js connects lazily on the first query, so importing this during `next build`
 * never touches the database. The client is reused across dev hot reloads.
 */
const globalForDb = globalThis as unknown as { pgClient?: postgres.Sql };

const client =
  globalForDb.pgClient ?? postgres(process.env.DATABASE_URL ?? "", { max: 5 });

if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
export { schema };
