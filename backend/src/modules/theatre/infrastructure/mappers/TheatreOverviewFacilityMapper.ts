import type { TheatreOverviewFacility } from '../../domain/types/TheatreOverviewFacility';

export class TheatreOverviewFacilityMapper {
  static toDomain(
    assignment: {
      facility: {
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
      };
    },
  ): TheatreOverviewFacility {
    return {
      id: assignment.facility.id,
      name: assignment.facility.name,
      description: assignment.facility.description,
      icon: assignment.facility.icon,
    };
  }

  static toDomainList(
    assignments: {
      facility: {
        id: string;
        name: string;
        description: string | null;
        icon: string | null;
      };
    }[],
  ): TheatreOverviewFacility[] {
    return assignments.map(this.toDomain);
  }
}