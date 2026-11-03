export const TheatreListSelect = {
  id: true,
  theatreId: true,
  name: true,
  slug: true,
  isActive: true,
  _count: {
    select: {
      seats: true,
      shows: true,
    },
  },
};
