import { Prisma } from "@prisma/client";
import { constants } from "node:http2";


export const movieAdminListSelect  = {
 id: true,
  title: true,
  posterUrl: true,
  releaseDate: true,
  certification: true,
  slug: true,
  isActive: true,

  primaryGenre: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },

  languages: {
    select: {
      language: {
        select: {
          id: true,
          name: true,
          code: true,
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
          slug: true,
        },
      },
    },
  },
 } as const