// Public module interface for the Shows Bounded Context

export { buildShowsModule } from './shows.module';
export type { ShowsModuleDependencies } from './shows.module';

export { ShowStatus } from './domain/enums/ShowStatus';
export {
  MIN_SHOW_SEAT_PRICE_PAISE,
  DEFAULT_CLEANING_BUFFER_MINUTES,
  QUICK_CLEANING_BUFFER_OPTIONS,
} from './domain/constants/ShowPricingConstants';

export type { ShowResultDTO } from './application/dtos/ShowResultDTO';
export type { ShowListItem } from './application/read-models/ShowListItem';
export type {
  ShowDetail,
  ShowSeatTierPricing,
} from './application/read-models/ShowDetail';

