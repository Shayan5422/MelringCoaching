import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Connection for queries
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL environment variable is required");
}

// For Vercel serverless environment, disable connection pooling
const client = postgres(connectionString, {
  ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : 'require',
  prepare: false,
  max: 1, // Single connection for serverless
  idle_timeout: 20,
  connect_timeout: 10
});

export const db = drizzle(client);