import { Prisma } from '@prisma/client';

export const movieAdminDetailSelect = {
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
      id: true,
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
    orderBy: {
      id: 'asc',
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
    orderBy: {
      id: 'asc',
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
    orderBy: {
      id: 'asc',
    },
  },

  cast: {
    select: {
      id: true,
      personId: true,
      character: true,
      person: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  },

  crew: {
    select: {
      id: true,
      personId: true,
      job: true,
      person: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  },
} satisfies Prisma.MovieSelect;
