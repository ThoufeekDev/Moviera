import { z } from 'zod';

export const clientCreateTheatreSchema = z
  .object({
    // Location identifier and resolution fields
    cityId: z.string().trim().optional().or(z.literal('')),
    cityName: z
      .string()
      .trim()
      .max(100, 'City name must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    areaName: z
      .string()
      .trim()
      .max(100, 'Area name must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    district: z
      .string()
      .trim()
      .max(100, 'District must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    state: z
      .string()
      .trim()
      .max(100, 'State must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    country: z
      .string()
      .trim()
      .max(100, 'Country must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    googlePlaceId: z.string().trim().max(255).optional().or(z.literal('')),

    // Core Theatre fields
    name: z
      .string()
      .trim()
      .min(2, 'Theatre name must be between 2 and 100 characters')
      .max(100, 'Theatre name must be between 2 and 100 characters'),
    address: z
      .string()
      .trim()
      .min(1, 'Street address is required')
      .max(500, 'Address must not exceed 500 characters'),
    description: z
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .optional()
      .or(z.literal('')),
    email: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        'Please enter a valid email address (e.g. contact@cinema.com)',
      ),
    phone: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || /^(?:\+91)?[6-9]\d{9}$/.test(val),
        'Phone must be a valid 10-digit Indian number (e.g. 9876543210 or +919876543210)',
      ),
    pincode: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => !val || /^[1-9][0-9]{5}$/.test(val),
        'Pincode must be exactly 6 digits (e.g. 560001)',
      ),
    landmark: z
      .string()
      .trim()
      .max(200, 'Landmark must not exceed 200 characters')
      .optional()
      .or(z.literal('')),
    licenseNumber: z
      .string()
      .trim()
      .max(100, 'Licence number must not exceed 100 characters')
      .optional()
      .or(z.literal('')),
    latitude: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => {
          if (!val) return true;
          const num = Number(val);
          return !Number.isNaN(num) && num >= -90 && num <= 90;
        },
        'Latitude must be a number between -90 and 90',
      ),
    longitude: z
      .string()
      .trim()
      .optional()
      .or(z.literal(''))
      .refine(
        (val) => {
          if (!val) return true;
          const num = Number(val);
          return !Number.isNaN(num) && num >= -180 && num <= 180;
        },
        'Longitude must be a number between -180 and 180',
      ),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      const hasLat = Boolean(data.latitude && data.latitude.trim() !== '');
      const hasLng = Boolean(data.longitude && data.longitude.trim() !== '');
      return (hasLat && hasLng) || (!hasLat && !hasLng);
    },
    {
      message: 'Latitude and longitude must both be provided together, or both omitted.',
      path: ['latitude'],
    },
  )
  .refine(
    (data) => {
      // Either select an existing city OR provide cityName, state, and country
      const hasCityId = Boolean(data.cityId && data.cityId.trim() !== '');
      const hasCityDetails = Boolean(
        data.cityName &&
          data.cityName.trim() !== '' &&
          data.state &&
          data.state.trim() !== '' &&
          data.country &&
          data.country.trim() !== '',
      );

      return hasCityId || hasCityDetails;
    },
    {
      message: 'Select an existing city or provide City Name, State, and Country.',
      path: ['cityName'],
    },
  );

export type FormValues = z.infer<typeof clientCreateTheatreSchema>;
export type CreateTheatreFormValues = FormValues;

export const defaultCreateTheatreFormValues: FormValues = {
  cityId: '',
  cityName: '',
  areaName: '',
  district: '',
  state: '',
  country: 'India',
  googlePlaceId: '',
  name: '',
  address: '',
  description: '',
  email: '',
  phone: '',
  pincode: '',
  landmark: '',
  licenseNumber: '',
  latitude: '',
  longitude: '',
  isActive: true,
};
