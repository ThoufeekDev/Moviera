import type { CreateScreenFormValues } from '../schemas/createScreenForm.schema';
import type { CreateScreenPayload } from '../types/screen.types';

export function buildCreateScreenPayload(
  theatreId: string,
  values: CreateScreenFormValues,
): CreateScreenPayload {
  const cinemaFormatIds = (values.cinemaFormatIds ?? [])
    .map((id) => id.trim())
    .filter(Boolean);

  return {
    theatreId,
    name: values.name.trim().replace(/\s+/g, ' '),
    ...(cinemaFormatIds.length > 0
      ? { cinemaFormatIds: [...new Set(cinemaFormatIds)] }
      : {}),
  };
}
