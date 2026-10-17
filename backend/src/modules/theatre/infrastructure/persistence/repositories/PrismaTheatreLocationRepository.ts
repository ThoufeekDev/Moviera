
import { PrismaClient } from '@prisma/client';

import {
  ITheatreLocationRepository,
  CityLocation,
  AreaLocation,
  CreateCityData,
  CreateAreaData,
} from '../../../domain/repositories/ITheatreLocationRepository';

export class PrismaTheatreLocationRepository
  implements ITheatreLocationRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async findCityById(id: string): Promise<CityLocation | null> {
    return this.prisma.city.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        district: true,
        state: true,
        country: true,
        slug: true,
        isActive: true,
      },
    });
  }

  async findCityByName(
    name: string,
    state: string,
    country: string,
  ): Promise<CityLocation | null> {
    return this.prisma.city.findFirst({
      where: {
        name: { equals: name.trim(), mode: 'insensitive' },
        state: { equals: state.trim(), mode: 'insensitive' },
        country: { equals: country.trim(), mode: 'insensitive' },
      },
      select: {
        id: true,
        name: true,
        district: true,
        state: true,
        country: true,
        slug: true,
        isActive: true,
      },
    });
  }

  async createCity(data: CreateCityData): Promise<CityLocation> {
    return this.prisma.city.create({
      data: {
        name: data.name,
        district: data.district,
        state: data.state,
        country: data.country,
        slug: data.slug,
      },
      select: {
        id: true,
        name: true,
        district: true,
        state: true,
        country: true,
        slug: true,
        isActive: true,
      },
    });
  }

  async findAreaById(id: string): Promise<AreaLocation | null> {
    return this.prisma.area.findUnique({
      where: { id },
      select: {
        id: true,
        cityId: true,
        name: true,
        slug: true,
        isActive: true,
      },
    });
  }

  async findAreaByName(
    cityId: string,
    name: string,
  ): Promise<AreaLocation | null> {
    return this.prisma.area.findFirst({
      where: {
        cityId,
        name: { equals: name.trim(), mode: 'insensitive' },
      },
      select: {
        id: true,
        cityId: true,
        name: true,
        slug: true,
        isActive: true,
      },
    });
  }

  async createArea(data: CreateAreaData): Promise<AreaLocation> {
    return this.prisma.area.create({
      data: {
        cityId: data.cityId,
        name: data.name,
        slug: data.slug,
      },
      select: {
        id: true,
        cityId: true,
        name: true,
        slug: true,
        isActive: true,
      },
    });
  }
}
