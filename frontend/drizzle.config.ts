import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Pehle .env load karne ki koshish karein
dotenv.config({ path: ".env" });
// Agar wahan nahi mila, to .env.local check karein
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});