import type { CreateShowFormValues } from '../schemas/createShowForm.schema';

export type CreateShowFormField = keyof CreateShowFormValues;

const VALID_SHOW_FORM_FIELDS: readonly CreateShowFormField[] = [
  'theatreId',
  'movieId',
  'screenId',
  'cinemaFormatId',
  'showDate',
  'showTime',
  'basePriceRupees',
  'priceAdjustmentsRupees',
];

export function mapShowServerFieldToFormField(
  serverField: string | undefined,
): CreateShowFormField | null {
  if (!serverField) return null;

  if (serverField === 'startTime' || serverField === 'endTime') {
    return 'showTime';
  }
  if (serverField === 'basePrice') {
    return 'basePriceRupees';
  }
  if (serverField.startsWith('priceAdjustments')) {
    return 'priceAdjustmentsRupees';
  }

  if ((VALID_SHOW_FORM_FIELDS as readonly string[]).includes(serverField)) {
    return serverField as CreateShowFormField;
  }

  return null;
}

