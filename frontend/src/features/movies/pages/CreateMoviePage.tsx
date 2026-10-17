import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieForm from '../components/MovieForm';
import { SuccessModal } from '@/shared/ui';
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
  const [createdMovieTitle, setCreatedMovieTitle] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = async (data: CreateMovieFormData) => {
    await createMovie(data);
    setCreatedMovieTitle(data.title);
    setIsSuccessModalOpen(true);
  };

  const handleCreateAnother = () => {
    setIsSuccessModalOpen(false);
    setCreatedMovieTitle('');
    setFormKey((prev) => prev + 1);
  };

  return (
    <>
      <MovieForm<CreateMovieFormInput, CreateMovieFormData>
        key={formKey}
        schema={createMovieSchema}
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Publish Movie"
        headerTitle="Create New Movie"
        headerDescription="Configure cinematic release information, projection formats, media art, and production credits."
        backLink={{
          to: '/super-admin/movies',
          label: 'Back to Manage Movies',
        }}
        onCancel={() => navigate('/super-admin/movies')}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => navigate('/super-admin/movies')}
        title="Movie Created Successfully!"
        description="The movie has been registered and is now available in the Moviera catalog."
        entityName={createdMovieTitle}
        entityType="Movie"
        primaryAction={{
          label: 'Go to Manage Movies',
          onClick: () => navigate('/super-admin/movies'),
        }}
        secondaryAction={{
          label: 'Create Another Movie',
          onClick: handleCreateAnother,
        }}
      />
    </>
  );
}
