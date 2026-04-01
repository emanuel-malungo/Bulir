import express from 'express';
import authRoutes from "./core/auth/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========== Routes ===========
app.use('/api/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('Hello, World!');
});

export default app;