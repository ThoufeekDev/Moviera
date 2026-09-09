import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from '../../../../../shared/components/Input/Input';
import Button from '../../../../../shared/components/Button/Button';

import {
  createMovieSchema,
  type CreateMovieFormInput,
  type CreateMovieFormData,
} from '../../../validators/createMovie.schema';
export default function SuperAdminCreateMoviePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMovieFormInput, any, CreateMovieFormData>({
    resolver: zodResolver(createMovieSchema),
  });

  const onSubmit = (data: CreateMovieFormData) => {
    console.log('Movie data:', data);
  };

  return (
    <div>
      <h1>Add Movie</h1>
      <p>Add a new movie to Moviera.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          id="movie-title"
          label="Movie Title"
          placeholder="Enter movie title"
          {...register('title')}
          error={errors.title?.message}
        />

        <div>
          <label htmlFor="movie-description">Description</label>

          <textarea
            id="movie-description"
            placeholder="Enter movie description"
            {...register('description')}
          />

          {errors.description && <p>{errors.description.message}</p>}
        </div>

        <Input
          id="movie-duration"
          type="number"
          label="Duration (minutes)"
          placeholder="e.g. 150"
          {...register('duration', {
            valueAsNumber: true,
          })}
          error={errors.duration?.message}
        />

        <Input
          id="movie-release-date"
          type="date"
          label="Release Date"
          {...register('releaseDate')}
          error={errors.releaseDate?.message}
        />

        <Input
          id="movie-language"
          label="Language"
          placeholder="e.g. English"
          {...register('language')}
          error={errors.language?.message}
        />

        <Input
          id="movie-genre"
          label="Genre"
          placeholder="e.g. Action"
          {...register('genre')}
          error={errors.genre?.message}
        />

        <Input
          id="movie-certificate"
          label="Certificate"
          placeholder="e.g. U/A"
          {...register('certificate')}
          error={errors.certificate?.message}
        />

        <Input
          id="movie-trailer"
          type="url"
          label="YouTube Trailer URL"
          placeholder="https://www.youtube.com/watch?v=..."
          {...register('trailerUrl')}
          error={errors.trailerUrl?.message}
        />

        <Button type="submit">Create Movie</Button>
      </form>
    </div>
  );
}


