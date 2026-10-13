import { Seat } from "../../domain/entities/Seat";
import { ISeatRepository } from "../../domain/repositories/ISeatRepository";
import { CreateSeatDTO } from "../dtos/CreateSeatDTO";
import { IScreenRepository } from "../../domain/repositories/IScreenRepository";
import type { ITheatreAccessPolicy } from "../ports/ITheatreAccessPolicy";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { ForbiddenError } from "../../../../shared/errors/ForbiddenError";
export class CreateSeatUseCase {
  constructor(
    private readonly seatRepository: ISeatRepository,
    private readonly screenRepository: IScreenRepository,
    private readonly theatreAccessPolicy:ITheatreAccessPolicy,
  ) {}

  async execute(seat: CreateSeatDTO): Promise<Seat> {
    const screen = await this.screenRepository.findById(seat.screenId);

    if (!screen) throw new NotFoundError("Screen not found");

    if (!screen.isActive) throw new ConflictError("Screen is inActive");

    const allowed = await this.theatreAccessPolicy.canManage(seat.actor, screen.theatreId)
    
    if(!allowed) throw new ForbiddenError("You are not assigned to manage this theatre")

    const label = `${seat.rowLabel}$${seat.seatNumber}`;

    const existingSeat = await this.seatRepository.findByLabel(seat.screenId, label);

    if (existingSeat)
      throw new ConflictError("Seat with this label already exists in theis screen");

    return this.seatRepository.create({
      screenId: seat.screenId,
      rowLabel: seat.rowLabel,
      seatNumber: seat.seatNumber,
      label,
      x: seat.x,
      y: seat.y,
      rotation: seat.rotation ?? 0,
      type: seat.type,
    });
  }
}
