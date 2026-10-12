import type { City } from '@prisma/client';
import type { Theatre } from '../../domain/entities/Theatre';

export interface TheatreWithCity {
  theatre: Theatre;
  city: City;
}
