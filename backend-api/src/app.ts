import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from "./core/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import serviceRoutes from "./modules/service/service.routes.js";
import reservationRoutes from "./modules/reservation/reservation.routes.js";
import roleRoutes from "./modules/roles/roles.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";

const app = express();

// ===== CORS Configuration with credentials =====
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// =========== Routes ===========
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/wallet', walletRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

export default app;