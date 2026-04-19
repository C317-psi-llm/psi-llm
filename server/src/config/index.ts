import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/mentis";
export const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
export const NODE_ENV = process.env.NODE_ENV || "development";
