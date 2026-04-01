import bcrypt from "bcrypt";
import ENV from "../config/env.config.js";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = await bcrypt.genSalt(Number(ENV.BCRYPT_SALT_ROUNDS) || 10);
  return bcrypt.hash(password, saltRounds);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
}