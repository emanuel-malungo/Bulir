import dotenv from "dotenv";
dotenv.config();

const ENV = {
  // ===== Server =====
  PORT: Number(process.env['PORT']) || 3000,

  // ===== Database (Prisma) =====
  DATABASE_URL: process.env['DATABASE_URL'] || "",

  // ===== JWT Auth =====
  JWT_SECRET: process.env['JWT_SECRET'] || "",
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || "1h",

  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] || "",
  JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] || "7d",

  // ===== Security =====
  BCRYPT_SALT_ROUNDS: Number(process.env['BCRYPT_SALT_ROUNDS']) || 10
};

export default ENV;