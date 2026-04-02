import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import ENV from "./env.config.js";

const adapter = new PrismaMariaDb({
    host: ENV.DATABASE_HOST,
    user: ENV.DATABASE_USER,
    password: ENV.DATABASE_PASSWORD,
    database: ENV.DATABASE_NAME,
    connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export default prisma;