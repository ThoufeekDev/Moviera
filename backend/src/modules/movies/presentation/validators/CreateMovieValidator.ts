import { z } from 'zod';
import { Certification } from '../../../../shared/enums/Certification';


// duration → converts "169" → 169
// releaseDate → converts string → Date
// languages → JSON string → string[]
// cast → JSON string → cast array
// crew → JSON string → crew array
// posterUrl / backdropUrl → optional Cloudinary URLs


export const createMovieSchema = z.object({
  title: z.string().min(1),

  description: z.string().optional(),

  duration: z.coerce.number().positive(),

  releaseDate: z.coerce.date(),
  //from multipart/form-data, that's actually a string, not an array.
  // We need to transform the JSON string into an array.
  languages: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(z.array(z.string().min(1)).min(1)),

  cast: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(
      z.array(
        z.object({
          personId: z.string().min(1),
          character: z.string().optional(),
        }),
      ),
    ),

  crew: z
    .string()
    .transform((value) => JSON.parse(value))
    .pipe(
      z.array(
        z.object({
          personId: z.string().min(1),
          job: z.string().min(1),
        }),
      ),
    ),

  primaryGenreId: z.string().min(1, "Primary genre is required"),
  

  certification: z.enum(Certification),
cinemaFormatIds: z
  .string()
  .transform((value) => JSON.parse(value))
  .pipe(
    z.array(z.string().min(1)).min(1, "At least one cinema format is required")
  ),
  trailerUrl: z.url().optional(),
});



