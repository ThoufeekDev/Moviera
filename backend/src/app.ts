import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/presentation/routes/auth.routes';
import movieRouter from "./modules/movies/presentation/routes/movie.routes"
import cors from 'cors';
import { errorHandler } from './shared/middleware/errrorHandler';

import { authenticateUser } from './shared/middleware/authenticateUser';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use('/auth',authenticateUser, authRoutes);



app.use('/api/movies',movieRouter)









// Error Handling Middleware

app.use(errorHandler);
export default app;
