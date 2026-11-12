import { ShowStatus } from '../enums/ShowStatus';
import type { ShowProps } from '../types/ShowProps';

export class Show {
  private constructor(private readonly props: ShowProps) {}

  static reconstitute(props: ShowProps): Show {
    return new Show(props);
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

  publish(): void {
    if (this.props.status !== ShowStatus.DRAFT) {
      throw new Error('Only draft shows can be published');
    }

    this.props.status = ShowStatus.PUBLISHED;
  }

  cancel(): void {
    if (this.props.status === ShowStatus.CANCELLED) {
      throw new Error('Show is already cancelled');
    }

    this.props.status = ShowStatus.CANCELLED;
  }
}