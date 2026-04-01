import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import ENV from "../config/env.config.js"

export const signAccessToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN as any
  };
  return jwt.sign(payload, ENV.JWT_SECRET as string, options);
};

export const signRefreshToken = (payload: object) => {
  const options: SignOptions = {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any
  };
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET as string, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
};