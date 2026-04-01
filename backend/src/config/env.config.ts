import dotenv from "dotenv";
dotenv.config();

const ENV = {
  // ===== Server =====
  PORT: Number(process.env['PORT']) || 3000,

  // ===== Database (Prisma) =====
  DATABASE_URL: process.env['DATABASE_URL'] || "",
  DATABASE_HOST: process.env['DATABASE_HOST'] || "",
  DATABASE_USER: process.env['DATABASE_USER'] || "",
  DATABASE_PASSWORD: process.env['DATABASE_PASSWORD'] || "",
  DATABASE_NAME: process.env['DATABASE_NAME'] || "",

  // ===== JWT Auth =====
  JWT_SECRET: process.env['JWT_SECRET'] || "",
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || "1h",

  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET'] || "",
  JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] || "7d",

  // ===== Security =====
  BCRYPT_SALT_ROUNDS: Number(process.env['BCRYPT_SALT_ROUNDS']) || 10
};

export default ENV;