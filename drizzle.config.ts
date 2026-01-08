import type { Config } from "drizzle-kit";

const url = new URL(process.env.DATABASE_URL!);

const dbCredentials = {
  protocol: url.protocol.replace(":", ""),
  host: url.hostname,
  port: url.port ? Number(url.port) : 5432,
  database: url.pathname.replace("/", ""),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  params: Object.fromEntries(url.searchParams.entries()),
};

export default {
  schema: "./src/db/*schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials,
} satisfies Config;
