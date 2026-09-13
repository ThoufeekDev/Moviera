import { z } from 'zod';


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

  genre: z.string().min(1),

  certificate: z.string().min(1),

  trailerUrl: z.url().optional(),
});






// import { z } from 'zod';

// const jsonArray = <T extends z.ZodTypeAny>(schema: T) =>
//   z.preprocess((value) => {
//     if (typeof value !== 'string') {
//       return value;
//     }

//     try {
//       return JSON.parse(value);
//     } catch {
//       return undefined;
//     }
//   }, schema);

// export const createMovieSchema = z.object({
//   title: z.string().min(1),

//   description: z.string().optional(),

//   duration: z.coerce.number().positive(),

//   releaseDate: z.coerce.date(),

//   languages: jsonArray(z.array(z.string().min(1)).min(1)),

//   cast: jsonArray(
//     z.array(
//       z.object({
//         personId: z.string().min(1),
//         character: z.string().optional(),
//       }),
//     ),
//   ),

//   crew: jsonArray(
//     z.array(
//       z.object({
//         personId: z.string().min(1),
//         job: z.string().min(1),
//       }),
//     ),
//   ),

//   genre: z.string().min(1),

//   certificate: z.string().min(1),

//   posterUrl: z.url().optional(),

//   backdropUrl: z.url().optional(),

//   trailerUrl: z.url().optional(),
// });