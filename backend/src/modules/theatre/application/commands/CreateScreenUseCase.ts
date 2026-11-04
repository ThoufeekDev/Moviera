import type { ITheatreRepository } from "../../domain/repositories/ITheatreRepository";
import type { IScreenRepository } from "../../domain/repositories/IScreenRepository";
import type { ITheatreAccessPolicy } from "../ports/ITheatreAccessPolicy";
import type { CreateScreenDTO } from "../dtos/CreateScreenDTO";
import type { ScreenResultDTO } from "../dtos/ScreenResultDTO";
import type { IUseCase } from "../../../../shared/application/interfaces/IUseCase";
import { generateSlug } from "../../../../shared/utils/generateSlug";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { ConflictError } from "../../../../shared/errors/ConflictError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { ForbiddenError } from "../../../../shared/errors/ForbiddenError";

export class CreateScreenUseCase implements IUseCase<CreateScreenDTO, ScreenResultDTO> {
  constructor(
    private readonly screenRepository: IScreenRepository,
    private readonly theatreRepository: ITheatreRepository,
    private readonly theatreAccessPolicy: ITheatreAccessPolicy,
  ) {}

  async execute(screen: CreateScreenDTO): Promise<ScreenResultDTO> {
    const name = screen.name.trim().replace(/\s+/g, ' ');

    const theatre = await this.theatreRepository.findById(screen.theatreId);
    if (!theatre) throw new NotFoundError("Theatre not found");

    if (!theatre.isActive) throw new ForbiddenError("Theatre is inActive");

    const allowed = await this.theatreAccessPolicy.canManage(screen.actor, screen.theatreId);

    if (!allowed) throw new ForbiddenError('You are not assigned to manage this theatre');

    const existingScreen = await this.screenRepository.findByName(screen.theatreId, name);

    if (existingScreen) {
      throw new ConflictError("Screen with this name already exists in this theatre", {
        field: 'name',
      });
    }

    const slug = generateSlug(name);
    if (!slug) {
      throw new BadRequestError("Screen name must contain at least one letter or number");
    }

    // Names like "Screen 1" and "Screen-1" differ but share a slug, which is unique per theatre.
    const slugClash = await this.screenRepository.findBySlug(screen.theatreId, slug);
    if (slugClash) {
      throw new ConflictError(
        `Screen name is too similar to the existing screen "${slugClash.name}"`,
        { field: 'name' },
      );
    }

    const created = await this.screenRepository.create({
      theatreId: screen.theatreId,
      name,
      slug,
    });

    return {
      id: created.id,
      theatreId: created.theatreId,
      name: created.name,
      slug: created.slug,
      isActive: created.isActive,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
