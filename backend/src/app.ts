import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './modules/auth/presentation/routes/auth.routes';
import theatreRoute from './modules/theatre/presentation/routes/theatre.route';
import seatRoute from './modules/theatre/presentation/routes/seat.route';
import { container } from './main/container';
import { errorHandler } from './shared/middleware/errrorHandler';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

// Auth
app.use('/auth', authRoutes);

// Movies Module (Catalog & Management)
app.use('/movies', container.movies.movieRouter);
app.use('/persons', container.movies.personRouter);
app.use('/language', container.movies.languageRouter);
app.use('/languages', container.movies.languageRouter);
app.use('/cinema-format', container.movies.cinemaFormatRouter);
app.use('/cinema-formats', container.movies.cinemaFormatRouter);
app.use('/genre', container.movies.genreRouter);
app.use('/genres', container.movies.genreRouter);

// Theatre Module
app.use('/theatres', theatreRoute);
app.use('/theatres', seatRoute);

// Error Handling Middleware
app.use(errorHandler);

export default app;
