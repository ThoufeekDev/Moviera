import { DomainError } from '../../../../shared/domain/errors/DomainError';
import { MIN_SHOW_SEAT_PRICE_PAISE } from '../constants/ShowPricingConstants';
import { ShowStatus } from '../enums/ShowStatus';
import type { ShowProps } from '../types/ShowProps';

export interface UpdateShowEntityInput {
  movieId: string;
  cinemaFormatId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
}

export class Show {
  private constructor(private readonly props: ShowProps) {}

  static reconstitute(props: ShowProps): Show {
    return new Show({
      ...props,
      isActive: props.isActive ?? props.status !== ShowStatus.CANCELLED,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get movieId(): string {
    return this.props.movieId;
  }

  get screenId(): string {
    return this.props.screenId;
  }

  get cinemaFormatId(): string {
    return this.props.cinemaFormatId;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date {
    return this.props.endTime;
  }

  get basePrice(): number {
    return this.props.basePrice;
  }

  get status(): ShowStatus {
    return this.props.status;
  }

  get isActive(): boolean {
    return this.props.isActive ?? this.props.status !== ShowStatus.CANCELLED;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  publish(): void {
    if (this.props.status !== ShowStatus.DRAFT) {
      throw new DomainError('Only draft shows can be published');
    }

    this.props.status = ShowStatus.PUBLISHED;
    this.props.isActive = true;
  }

  cancel(): void {
    if (this.props.status === ShowStatus.CANCELLED) {
      throw new DomainError('Show is already cancelled');
    }

    this.props.status = ShowStatus.CANCELLED;
    this.props.isActive = false;
  }

  updateDetails(updates: UpdateShowEntityInput): void {
    if (this.props.status === ShowStatus.CANCELLED) {
      throw new DomainError('Cannot update a cancelled show');
    }

    if (updates.endTime.getTime() <= updates.startTime.getTime()) {
      throw new DomainError('Show end time must be after start time');
    }

    if (!Number.isInteger(updates.basePrice) || updates.basePrice < MIN_SHOW_SEAT_PRICE_PAISE) {
      throw new DomainError('Show base price must be an integer of at least 100 paise (₹1)');
    }

    this.props.movieId = updates.movieId;
    this.props.cinemaFormatId = updates.cinemaFormatId;
    this.props.startTime = updates.startTime;
    this.props.endTime = updates.endTime;
    this.props.basePrice = updates.basePrice;
  }
}
