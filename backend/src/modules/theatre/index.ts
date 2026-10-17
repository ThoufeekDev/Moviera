// Public module interface for the Theatre Bounded Context

export { buildTheatreModule } from './theatre.module';

// Read models
export type { TheatreOverview } from './application/read-models/TheatreOverview';
export type { TheatreWithCity } from './application/read-models/TheatreWithCity';
export type { TheatreOverviewFacility } from './application/read-models/TheatreOverviewFacility';
export type { SuperAdminFacilityListItem } from './application/read-models/SuperAdminFacilityListItem';
export type { ActiveFacilityOption } from './application/read-models/ActiveFacilityOption';
export { ALLOWED_FACILITY_ICON_KEYS, type FacilityIconKey } from './domain/constants/FacilityIconKey';
