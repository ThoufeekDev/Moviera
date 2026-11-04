import type { CreateScreenFormValues } from '../schemas/createScreenForm.schema';
import type { CreateScreenPayload } from '../types/screen.types';

export function buildCreateScreenPayload(
  theatreId: string,
  values: CreateScreenFormValues,
): CreateScreenPayload {
  return {
    theatreId,
    name: values.name.trim().replace(/\s+/g, ' '),
  };
}
