import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";

export async function loginService(email: string, senha: string) {
  const result = await pool.query(
    `SELECT id_usuario, id_empresa, nome, email, senha_hash, papel, status, aceitou_lgpd
     FROM usuario WHERE email = $1`,
    [email],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Credenciais inválidas.");
  }

  if (user.status !== "ativo") {
    throw new Error("Usuário inativo.");
  }

  const senhaValida = await bcrypt.compare(senha, user.senha_hash);
  if (!senhaValida) {
    throw new Error("Credenciais inválidas.");
  }

  await pool.query(
    `UPDATE usuario
     SET ultimo_acesso = NOW(),
         dias_acesso = COALESCE(dias_acesso, 0) + 1
     WHERE id_usuario = $1`,
    [user.id_usuario],
  );

  const secret = process.env.JWT_SECRET as jwt.Secret;
  const opts: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "8h") as any,
  };
  const token = jwt.sign(
    {
      id_usuario: user.id_usuario,
      papel: user.papel,
      id_empresa: user.id_empresa,
      aceitou_lgpd: user.aceitou_lgpd,
    } as any,
    secret,
    opts,
  );

  return {
    token,
    usuario: {
      id_usuario: user.id_usuario,
      nome: user.nome,
      email: user.email,
      papel: user.papel,
      aceitou_lgpd: user.aceitou_lgpd,
    },
  };
}

export async function registerService(data: {
  id_empresa: number;
  nome: string;
  email: string;
  senha: string;
  papel: string;
}) {
  const { id_empresa, nome, email, senha, papel } = data;

  const existe = await pool.query(
    "SELECT id_usuario FROM usuario WHERE email = $1",
    [email],
  );
  if (existe.rows.length > 0) {
    throw new Error("E-mail já cadastrado.");
  }

  const senha_hash = await bcrypt.hash(senha, 10);

  const result = await pool.query(
    `INSERT INTO usuario (id_empresa, nome, email, senha_hash, papel)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_usuario, nome, email, papel`,
    [id_empresa, nome, email, senha_hash, papel],
  );

  return result.rows[0];
}
