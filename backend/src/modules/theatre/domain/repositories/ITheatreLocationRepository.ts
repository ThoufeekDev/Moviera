export interface CityLocation {
    id: string;
    name: string;
    district: string | null; 
    state: string;
    country: string;
    slug: string;
    isActive: boolean;
}


export interface AreaLocation {
    id: string;
    cityId: string;
    name: string;
    slug: string;
    isActive:boolean
}

export interface CreateCityData {
    name: string;
    district: string | null;
    state: string;
    country: string;
    slug: string;
}

export interface CreateAreaData {
    cityId: string;
    name: string;
    slug: string;
}





export interface ResolveTheatreLocationInput {
  cityId?: string | null;
  areaId?: string | null;

  cityName?: string | null;
  areaName?: string | null;
  district?: string | null;
  state?: string | null;
  country?: string | null;
}

export interface ResolvedTheatreLocation {
  cityId: string;
  areaId: string | null;
}

export interface ITheatreLocationRepository {
  findCityById(cityId: string): Promise<CityLocation | null>;

  findCityByName(name: string, state: string, country: string): Promise<CityLocation | null>;

  createCity(data: CreateCityData): Promise<CityLocation>;

  findAreaById(areaId: string): Promise<AreaLocation | null>;

  findAreaByName(cityId: string, name: string): Promise<AreaLocation | null>;

  createArea(data: CreateAreaData): Promise<AreaLocation>;
}
