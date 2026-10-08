import { Prisma } from '@prisma/client';

export const movieDetailSelect = {
  id: true,
  title: true,
  slug: true,
  posterUrl: true,
  backdropUrl: true,
  certification: true,
  description: true,
  releaseDate: true,
  duration: true,
  trailerUrl: true,
  isActive: true,

  primaryGenre: {
    select: {
      name: true,
    },
  },

  genres: {
    select: {
      genre: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  languages: {
    select: {
      language: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  cinemaFormats: {
    select: {
      cinemaFormat: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  cast: {
    select: {
      id: true,
      character: true,
      person: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  },
  crew: {
    select: {
      id: true,
      job: true,
      person: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  },
} satisfies Prisma.MovieSelect;
