import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MovieForm from '../components/MovieForm';
import {
  updateMovieSchema,
  type UpdateMovieFormInput,
  type UpdateMovieFormData,
} from '../schemas/updateMovie.schema';
import { useMovieById } from '../hooks/useMovieById';
import { useUpdateMovie } from '../hooks/useUpdateMovie';
import { ContentLoader } from '@/shared/ui/ContentLoader';
import { ErrorState } from '@/shared/ui/ErrorState';

export default function EditMoviePage() {
  const navigate = useNavigate();
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isLoading,
    isError,
    error,
    refetch,
  } = useMovieById(movieId);

  const updateMovieMutation = useUpdateMovie();

  const defaultValues: UpdateMovieFormInput = useMemo(() => {
    if (!movie) {
      return {
        title: '',
        description: '',
        duration: undefined,
        releaseDate: '',
        primaryGenreId: '',
        genreIds: [],
        certificate: undefined as any,
        languages: [],
        theatreFormatIds: [],
        cast: [],
        crew: [],
        trailerUrl: '',
      };
    }

    return {
      title: movie.title,
      description: movie.description ?? '',
      duration: movie.duration,
      releaseDate: movie.releaseDate
        ? new Date(movie.releaseDate).toISOString().split('T')[0]
        : '',
      primaryGenreId: movie.primaryGenre.id,
      genreIds: movie.genres.map((genre) => genre.id),
      certificate: movie.certification as UpdateMovieFormInput['certificate'],
      languages: movie.languages.map((language) => language.id),
      theatreFormatIds: movie.theatreFormats.map((format) => format.id),
      trailerUrl: movie.trailerUrl ?? '',
      cast: (movie.cast ?? []).map((member) => ({
        personId: member.personId,
        character: member.character ?? '',
      })),
      crew: (movie.crew ?? []).map((member) => ({
        personId: member.personId,
        job: member.job,
      })),
    };
  }, [movie]);

  if (!movieId) {
    return (
      <ErrorState
        title="Movie ID Missing"
        message="No valid movie ID was specified in the URL."
        onRetry={() => navigate('/super-admin/movies')}
        retryText="Back to Movies"
      />
    );
  }

  if (isLoading) {
    return <ContentLoader text="Loading Movie" subtext="Fetching movie details for editing..." />;
  }

  if (isError || !movie) {
    return (
      <ErrorState
        title="Failed to Load Movie"
        message={
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading the movie details.'
        }
        onRetry={refetch}
      />
    );
  }

  const handleSubmit = async (data: UpdateMovieFormData) => {
    await updateMovieMutation.mutateAsync({ movieId, data });
    setTimeout(() => {
      navigate(`/super-admin/movies/${movieId}`);
    }, 1200);
  };

  return (
    <MovieForm<UpdateMovieFormInput, UpdateMovieFormData>
      schema={updateMovieSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel="Update Movie"
      headerTitle={`Edit Movie: ${movie.title}`}
      headerDescription="Update the movie details, media visuals, language options, cast, and crew members."
      initialPosterUrl={movie.posterUrl}
      initialBackdropUrl={movie.backdropUrl}
      backLink={{
        to: `/super-admin/movies/${movieId}`,
        label: 'Back to Movie Details',
      }}
      onCancel={() => navigate(`/super-admin/movies/${movieId}`)}
    />
  );
}