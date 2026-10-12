import { useNavigate } from 'react-router-dom';
import MovieForm from '../components/MovieForm';
import {
  createMovieSchema,
  type CreateMovieFormInput,
  type CreateMovieFormData,
} from '../schemas/createMovie.schema';
import { createMovie } from '../api/createMovie.api';

const initialValues: any = {
  title: '',
  description: '',
  duration: undefined,
  releaseDate: '',
  primaryGenreId: '',
  genreIds: [],
  certificate: undefined,
  languages: [],
  cinemaFormatIds: [],
  cast: [],
  crew: [],
  trailerUrl: '',
};

export default function CreateMoviePage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateMovieFormData) => {
    await createMovie(data);
    navigate('/super-admin/movies');
  };

  return (
    <MovieForm<CreateMovieFormInput, CreateMovieFormData>
      schema={createMovieSchema}
      defaultValues={initialValues}
      onSubmit={handleSubmit}
      submitLabel="Publish Movie"
      headerTitle="Add New Movie"
      headerDescription="Configure cinematic release information, projection formats, media art, and production credits."
      onCancel={() => navigate('/super-admin/movies')}
    />
  );
}
