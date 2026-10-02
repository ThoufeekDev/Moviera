import type { SeatProps } from "../types/SeatProps";
import type { SeatType } from "../enums/SeatType";
export class Seat {
    constructor(private readonly props: SeatProps) { };


    static create( props: SeatProps): Seat{
     return new Seat(props)
    }

  get id(): string {
    return this.props.id;
  }

  get screenId(): string {
    return this.props.screenId;
  }

  get rowLabel(): string {
    return this.props.rowLabel;
  }

  get seatNumber(): number {
    return this.props.seatNumber;
  }

  get label(): string {
    return this.props.label;
  }

  get x(): number {
    return this.props.x;
  }

  get y(): number {
    return this.props.y;
  }

  get rotation(): number {
    return this.props.rotation;
  }

  get type(): SeatType {
    return this.props.type;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}