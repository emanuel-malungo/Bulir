import express from 'express';
import authRoutes from "./core/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import serviceRoutes from "./modules/service/service.routes.js";
import reservationRoutes from "./modules/reservation/reservation.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========== Routes ===========
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reservations', reservationRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

export default app;