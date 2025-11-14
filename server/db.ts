import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Connection for queries
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL environment variable is required");
}

const client = postgres(connectionString, {
  ssl: 'require',
  prepare: false
});

export const db = drizzle(client);