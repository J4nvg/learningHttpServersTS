import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is not defined.");
}

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/o/",
  dialect: "postgresql",
  dbCredentials: {
    url: `${process.env.DB_URL}`,
  },
});