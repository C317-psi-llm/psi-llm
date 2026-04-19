import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";

export function signJwt(payload: object) {
  const secret = JWT_SECRET as Secret;
  const opts: SignOptions = { expiresIn: JWT_EXPIRES_IN } as SignOptions;
  return jwt.sign(payload as any, secret, opts);
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET as Secret) as any;
  } catch (err) {
    return null;
  }
}
