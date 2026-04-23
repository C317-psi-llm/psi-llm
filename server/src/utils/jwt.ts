import jwt from "jsonwebtoken";
import config from "../config";

export function signAccessToken(payload: object) {
  // cast to any to avoid strict typing issues with different jwt typings
  return jwt.sign(
    payload as any,
    config.jwt.accessSecret as any,
    {
      expiresIn: config.jwt.accessTTL as any,
    } as any,
  ) as string;
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token as any, config.jwt.accessSecret as any) as any;
}

export function signRefreshToken(payload: object) {
  return jwt.sign(
    payload as any,
    config.jwt.refreshSecret as any,
    {
      expiresIn: `${config.jwt.refreshTTLdays}d` as any,
    } as any,
  ) as string;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token as any, config.jwt.refreshSecret as any) as any;
}
