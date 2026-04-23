import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import UserRepository from "../repositories/user.repository";
import RefreshTokenRepository from "../repositories/refreshToken.repository";
import { hashToken } from "../utils/hash";
import { signAccessToken } from "../utils/jwt";

class AuthService {
  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw { status: 401, message: "Invalid credentials" };
    const valid = bcrypt.compareSync(password, user.senha_hash);
    if (!valid) throw { status: 401, message: "Invalid credentials" };

    // create refresh token record (opaque token)
    const rawRefresh = uuidv4();
    const tokenHash = hashToken(rawRefresh);
    const expiresAt = new Date(
      Date.now() + config.jwt.refreshTTLdays * 24 * 60 * 60 * 1000,
    );
    await RefreshTokenRepository.create({
      id_usuario: user.id_usuario,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

    const accessToken = signAccessToken({
      id_usuario: user.id_usuario,
      papel: user.papel,
    });
    return { accessToken, refreshToken: rawRefresh, user };
  }

  static async refresh(rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);
    const record = await RefreshTokenRepository.findByHash(tokenHash);
    if (!record || record.revoked)
      throw { status: 401, message: "Invalid refresh token" };
    if (new Date(record.expires_at) < new Date())
      throw { status: 401, message: "Refresh token expired" };

    const user = await UserRepository.findById(record.id_usuario);
    if (!user) throw { status: 401, message: "User not found" };

    // revoke old and create new (rotation)
    await RefreshTokenRepository.revoke(record.id);
    const newRaw = uuidv4();
    const newHash = hashToken(newRaw);
    const expiresAt = new Date(
      Date.now() + config.jwt.refreshTTLdays * 24 * 60 * 60 * 1000,
    );
    await RefreshTokenRepository.create({
      id_usuario: user.id_usuario,
      token_hash: newHash,
      expires_at: expiresAt,
    });

    const accessToken = signAccessToken({
      id_usuario: user.id_usuario,
      papel: user.papel,
    });
    return { accessToken, refreshToken: newRaw };
  }

  static async logout(rawRefreshToken: string) {
    const tokenHash = hashToken(rawRefreshToken);
    const record = await RefreshTokenRepository.findByHash(tokenHash);
    if (record) await RefreshTokenRepository.revoke(record.id);
  }
}

export default AuthService;
