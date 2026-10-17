import {
  ITheatreLocationRepository,
  ResolveTheatreLocationInput,
  ResolvedTheatreLocation,
} from '../../domain/repositories/ITheatreLocationRepository';

import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { generateSlug } from '../../../../shared/utils/generateSlug';

export class ResolveTheatreLocationService {
  constructor(private readonly locationRepository: ITheatreLocationRepository) {}

    async execute(input: ResolveTheatreLocationInput): Promise<ResolvedTheatreLocation> {
    const cityId = await this.resolveCity(input);
    const areaId = await this.resolveArea(cityId, input);

    return {
      cityId,
      areaId,
    };
  }

  private async resolveCity(input: ResolveTheatreLocationInput): Promise<string> {
    // ! 1. Reuse a city selected by ID.
    if (input.cityId) {
      const city = await this.locationRepository.findCityById(input.cityId);

      if (!city) {
        throw new NotFoundError('Selected city does not exist.');
      }

      if (!city.isActive) {
        throw new ConflictError('Selected city is inactive.');
      }

      return city.id;
    }

    // & 2. Require location details when no city ID is supplied.

    const name = input.cityName ?? '';
    const state = input.state ?? '';
    const country = input.country ?? '';

    if (!name || !state || !country) {
      throw new ConflictError('City name, state, and country are required.');
    }

    //  & 3. Reuse an existing city when possible.
    const existingCity = await this.locationRepository.findCityByName(name, state, country);

    if (existingCity) {
      if (!existingCity.isActive) {
        throw new ConflictError('The matching city exists but is inactive.');
      }

      return existingCity.id;
    }

    // * 4. Create a city when no matching record exists.
    const slug = generateSlug(`${name}-${state}-${country}`);

    if (!slug) {
      throw new ConflictError('Unable to generate a valid city slug.');
    }

    const createdCity = await this.locationRepository.createCity({
      name,
      district: input.district|| null,
      state,
      country,
      slug,
    });

    return createdCity.id;
  }

  private async resolveArea(
    cityId: string,
    input: ResolveTheatreLocationInput,
  ): Promise<string | null> {
    // * 1. Reuse an explicitly selected area.
    if (input.areaId) {
      const area = await this.locationRepository.findAreaById(input.areaId);

      if (!area) {
        throw new NotFoundError('Selected area does not exist.');
      }

      if (!area.isActive) {
        throw new ConflictError('Selected area is inactive.');
      }

      if (area.cityId !== cityId) {
        throw new ConflictError('Selected area does not belong to the resolved city.');
      }

      return area.id;
    }

    // & 2. An area is optional.
    const name = input.areaName ?? '';

    if (!name) {
      return null;
    }

    // ! 3. Reuse an existing area within the resolved city.

    const existingArea = await this.locationRepository.findAreaByName(cityId, name);

    if (existingArea) {
      if (!existingArea.isActive) {
        throw new ConflictError('The matching area exists but is inactive.');
      }

      return existingArea.id;
    }

    // ^ 4. Create the area if it doesn't exist.
    const slug = generateSlug(name);

    if (!slug) {
      throw new ConflictError('Unable to generate a valid area slug.');
    }

    const createdArea = await this.locationRepository.createArea({
      cityId,
      name,
      slug,
    });

    return createdArea.id;
  }
}
