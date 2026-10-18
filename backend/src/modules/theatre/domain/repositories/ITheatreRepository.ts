import { Theatre } from "../entities/Theatre";

export interface ITheatreRepository {
  findById(id: string): Promise<Theatre | null>;
  findByIdForAdmin(theatreId: string, adminId: string): Promise<Theatre | null>;
  create(theatre: Theatre,facilityIds?:string[]): Promise<Theatre>;
  findByNameAndCity(name: string, cityId: string): Promise<Theatre | null>;
  findByLicenseNumber(licenseNumber: string): Promise<Theatre | null>;
  existsByCityAndSlug(cityId: string, slug: string): Promise<boolean>;
  cityExists(cityId: string): Promise<boolean>;
}