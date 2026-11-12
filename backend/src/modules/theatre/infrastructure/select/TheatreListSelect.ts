export const TheatreListSelect = {
  id: true,
  theatreId: true,
  name: true,
  slug: true,
  isActive: true,
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
  _count: {
    select: {
      seats: true,
      shows: true,
    },
  },
};
