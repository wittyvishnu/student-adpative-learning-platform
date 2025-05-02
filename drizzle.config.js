import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://student-learning_owner:npg_gGXumSn31kLT@ep-young-bonus-a47b3wpr-pooler.us-east-1.aws.neon.tech/student-learning?sslmode=require",
  },
});
