
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/presentation/routes/auth.routes';
// import movieRouter from "./modules/movies/presentation/routes/movie.routes"
// import personRoutes from './modules/movies/presentation/routes/person.routes';
// import languageRoute from './modules/movies/presentation/routes/language.routes';
// import cinemaFormatRoute from './modules/movies/presentation/routes/cinema-format.routes';
// import genreRoute from './modules/movies/presentation/routes/genre.routes';


import { container } from './main/container';


// Theatre 
import theatreRoute from "./modules/theatre/presentation/routes/theatre.route"
import seatRoute from './modules/theatre/presentation/routes/seat.route';

import cors from 'cors';
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
app.use('/auth', authRoutes);



app.use('/movies', container.movies.movieRouter)
app.use('/persons', container.movies.personRouter)

app.use('/language',container.movies.languageRouter)

app.use('/cinema-format',container.movies.cinemaFormatRouter)

app.use("/genre", container.movies.genreRouter);



app.use('/theatres', theatreRoute);


app.use('/theatres',seatRoute)




// Error Handling Middleware

app.use(errorHandler);
export default app;
