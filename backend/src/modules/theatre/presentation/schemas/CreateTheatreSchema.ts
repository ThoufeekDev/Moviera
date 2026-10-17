
import { z } from 'zod';

const emptyToNull = (val: unknown) => {
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return trimmed === '' ? null : trimmed;
  }

  return val;
};

const parseOptionalCoordinate = (val: unknown) => {
  if (val === undefined || val === null || val === '') {
    return null;
  }

  const num = typeof val === 'number' ? val : Number(val);

  return Number.isNaN(num) ? val : num;
};

const parseBoolean = (val: unknown) => {
  if (val === undefined || val === null || val === '') {
    return true;
  }

  if (typeof val === 'boolean') {
    return val;
  }

  if (typeof val === 'string') {
    const lower = val.toLowerCase().trim();

    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }

  return val;
};

export const createTheatreSchema = z
  .object({
    // Existing location IDs (optional when resolving by name)
    cityId: z.preprocess(
      emptyToNull,
      z.string().trim().min(1).nullable().optional(),
    ),

    areaId: z.preprocess(
      emptyToNull,
      z.string().trim().min(1).nullable().optional(),
    ),

    // Location details from Google Places or manual entry
    cityName: z.preprocess(
      emptyToNull,
      z.string().trim().min(1).max(100).nullable().optional(),
    ),

    areaName: z.preprocess(
      emptyToNull,
      z.string().trim().min(1).max(100).nullable().optional(),
    ),

    district: z.preprocess(
      emptyToNull,
      z.string().trim().min(1).max(100).nullable().optional(),
    ),

    state: z.preprocess(
      emptyToNull,
      z.string().trim().min(1).max(100).nullable().optional(),
    ),

    country: z.preprocess(
      emptyToNull,
      z.string().trim().min(1).max(100).nullable().optional(),
    ),

    // Google Places integration
    googlePlaceId: z.preprocess(
      emptyToNull,
      z.string().trim().min(1).max(255).nullable().optional(),
    ),

    // Theatre details
    name: z
      .string({ message: 'Theatre name is required' })
      .trim()
      .min(2, 'Theatre name must be between 2 and 100 characters')
      .max(100, 'Theatre name must be between 2 and 100 characters'),

    address: z
      .string({ message: 'Address is required' })
      .trim()
      .min(1, 'Address is required')
      .max(500, 'Address must not exceed 500 characters'),

    description: z.preprocess(
      emptyToNull,
      z
        .string()
        .max(1000, 'Description must not exceed 1000 characters')
        .nullable()
        .optional(),
    ),

    email: z.preprocess(
      (val) => (typeof val === 'string' ? val.trim().toLowerCase() : val),
      z.preprocess(
        emptyToNull,
        z.string().email('Invalid email format').nullable().optional(),
      ),
    ),

    phone: z.preprocess(
      emptyToNull,
      z
        .string()
        .regex(
          /^(?:\+91)?[6-9]\d{9}$/,
          'Phone must be a valid 10-digit Indian number (e.g. 9876543210 or +919876543210)',
        )
        .nullable()
        .optional(),
    ),

    pincode: z.preprocess(
      emptyToNull,
      z
        .string()
        .regex(/^[1-9][0-9]{5}$/, 'Pincode must be exactly 6 digits')
        .nullable()
        .optional(),
    ),

    landmark: z.preprocess(
      emptyToNull,
      z
        .string()
        .max(200, 'Landmark must not exceed 200 characters')
        .nullable()
        .optional(),
    ),

    licenseNumber: z.preprocess(
      emptyToNull,
      z
        .string()
        .max(100, 'Licence number must not exceed 100 characters')
        .nullable()
        .optional(),
    ),

    latitude: z.preprocess(
      parseOptionalCoordinate,
      z
        .number({ message: 'Latitude must be a valid number' })
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .nullable()
        .optional(),
    ),

    longitude: z.preprocess(
      parseOptionalCoordinate,
      z
        .number({ message: 'Longitude must be a valid number' })
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .nullable()
        .optional(),
    ),

    isActive: z.preprocess(
      parseBoolean,
      z.boolean().default(true),
    ),
  })
  // Latitude and longitude must be supplied together.
  .refine(
    (data) => {
      const hasLat = data.latitude !== undefined && data.latitude !== null;
      const hasLng = data.longitude !== undefined && data.longitude !== null;

      return (hasLat && hasLng) || (!hasLat && !hasLng);
    },
    {
      message:
        'Latitude and longitude must both be provided together, or both omitted.',
      path: ['latitude'],
    },
  )
  // Either select an existing city or provide enough details to resolve one.
  .refine(
    (data) => {
      if (data.cityId) {
        return true;
      }

      return Boolean(
        data.cityName?.trim() &&
          data.state?.trim() &&
          data.country?.trim(),
      );
    },
    {
      message:
        'Select an existing city or provide city name, state, and country.',
      path: ['cityId'],
    },
  );

export type CreateTheatreInput = z.infer<typeof createTheatreSchema>;
