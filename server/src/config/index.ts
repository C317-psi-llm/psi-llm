import dotenv from "dotenv";
dotenv.config();

const toInt = (v: string | undefined, fallback: number) =>
  v ? parseInt(v, 10) : fallback;

export default {
  port: process.env.PORT || "4000",
  pg: {
    host: process.env.PGHOST || "db",
    port: toInt(process.env.PGPORT, 5432),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "mentis",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "change_me_access",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "change_me_refresh",
    accessTTL: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    refreshTTLdays: toInt(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS, 7),
  },
  bcryptSaltRounds: toInt(process.env.BCRYPT_SALT_ROUNDS, 10),
};
