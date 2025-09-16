import * as process from "node:process";

export const configuration = () => ({
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
});

export type TConfiguration = ReturnType<typeof configuration>;
