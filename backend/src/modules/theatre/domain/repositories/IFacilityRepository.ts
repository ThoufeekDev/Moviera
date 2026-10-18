import { Facility } from '../entities/Facility';

export interface IFacilityRepository {
  findById(id: string): Promise<Facility | null>;
  findByName(name: string): Promise<Facility | null>;
  findActiveByIds(ids: string[]): Promise<Facility[]>;
  findBySlug(slug: string): Promise<Facility | null>;
  create(facility: Facility): Promise<Facility>;
  update(facility: Facility): Promise<Facility>;
  existsByName(name: string, excludeId?: string): Promise<boolean>;
  existsBySlug(slug: string): Promise<boolean>;
}
