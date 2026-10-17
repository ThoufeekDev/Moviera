import type { FormValues } from '../schemas/createTheatreForm.schema';
import type { CreateTheatrePayload } from '../api/createTheatre.api';

export interface BuildCreateTheatrePayloadOptions {
  logoFile: File | null;
  locationMode: 'google' | 'manual';
}

export function buildCreateTheatrePayload(
  values: FormValues,
  { logoFile, locationMode }: BuildCreateTheatrePayloadOptions,
): CreateTheatrePayload {
  const latNumber =
    values.latitude && values.latitude.trim() !== '' ? Number(values.latitude) : null;
  const lngNumber =
    values.longitude && values.longitude.trim() !== '' ? Number(values.longitude) : null;

  // Build payload according to backend rules
  const hasLat = latNumber !== null && !Number.isNaN(latNumber);
  const hasLng = lngNumber !== null && !Number.isNaN(lngNumber);

  return {
    name: values.name.trim(),
    address: values.address.trim(),
    description: values.description?.trim() || undefined,
    email: values.email?.trim().toLowerCase() || undefined,
    phone: values.phone?.trim() || undefined,
    pincode: values.pincode?.trim() || undefined,
    landmark: values.landmark?.trim() || undefined,
    licenseNumber: values.licenseNumber?.trim() || undefined,
    latitude: hasLat && hasLng ? latNumber : null,
    longitude: hasLat && hasLng ? lngNumber : null,
    isActive: values.isActive,
    logo: logoFile,
    cityId: values.cityId && values.cityId.trim() !== '' ? values.cityId.trim() : undefined,
    cityName:
      !values.cityId && values.cityName && values.cityName.trim() !== ''
        ? values.cityName.trim()
        : undefined,
    state:
      !values.cityId && values.state && values.state.trim() !== ''
        ? values.state.trim()
        : undefined,
    country:
      !values.cityId && values.country && values.country.trim() !== ''
        ? values.country.trim()
        : undefined,
    areaName: values.areaName && values.areaName.trim() !== '' ? values.areaName.trim() : undefined,
    district: values.district && values.district.trim() !== '' ? values.district.trim() : undefined,
    // Google Place ID is sent ONLY when Google Places was selected
    googlePlaceId:
      locationMode === 'google' && values.googlePlaceId && values.googlePlaceId.trim() !== ''
        ? values.googlePlaceId.trim()
        : undefined,
  };
}
