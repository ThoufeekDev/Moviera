import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateScreenUseCase } from './CreateScreenUseCase';
import { Screen } from '../../domain/entities/Screen';
import type { IScreenRepository } from '../../domain/repositories/IScreenRepository';
import type { ITheatreRepository } from '../../domain/repositories/ITheatreRepository';
import type { ITheatreAccessPolicy } from '../ports/ITheatreAccessPolicy';
import type { Theatre } from '../../domain/entities/Theatre';
import type { CreateScreenProps } from '../../domain/types/CreateScreenProps';
import { Role } from '../../../../shared/enums/Role';
import { ConflictError } from '../../../../shared/errors/ConflictError';
import { ForbiddenError } from '../../../../shared/errors/ForbiddenError';
import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { BadRequestError } from '../../../../shared/errors/BadRequestError';

const actor = { userId: 'admin-1', role: Role.THEATRE_ADMIN };
const now = new Date('2026-01-01T00:00:00Z');

const buildScreen = (props: Partial<CreateScreenProps> & { id?: string } = {}): Screen =>
  Screen.restore({
    id: props.id ?? 'screen-1',
    theatreId: props.theatreId ?? 'theatre-1',
    name: props.name ?? 'Screen 1',
    slug: props.slug ?? 'screen-1',
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

describe('CreateScreenUseCase', () => {
  let screenRepository: {
    findById: ReturnType<typeof vi.fn>;
    findByName: ReturnType<typeof vi.fn>;
    findBySlug: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  let theatreRepository: { findById: ReturnType<typeof vi.fn> };
  let accessPolicy: { canManage: ReturnType<typeof vi.fn> };
  let useCase: CreateScreenUseCase;

  beforeEach(() => {
    screenRepository = {
      findById: vi.fn(),
      findByName: vi.fn().mockResolvedValue(null),
      findBySlug: vi.fn().mockResolvedValue(null),
      create: vi.fn(async (props: CreateScreenProps) => buildScreen(props)),
    };
    theatreRepository = {
      findById: vi.fn().mockResolvedValue({ id: 'theatre-1', isActive: true } as Theatre),
    };
    accessPolicy = { canManage: vi.fn().mockResolvedValue(true) };

    useCase = new CreateScreenUseCase(
      screenRepository as unknown as IScreenRepository,
      theatreRepository as unknown as ITheatreRepository,
      accessPolicy as unknown as ITheatreAccessPolicy,
    );
  });

  it('creates a screen with a normalized name and server-generated slug', async () => {
    const result = await useCase.execute({
      theatreId: 'theatre-1',
      name: '  Audi   1  ',
      actor,
    });

    expect(screenRepository.findByName).toHaveBeenCalledWith('theatre-1', 'Audi 1');
    expect(screenRepository.findBySlug).toHaveBeenCalledWith('theatre-1', 'audi-1');
    expect(screenRepository.create).toHaveBeenCalledWith({
      theatreId: 'theatre-1',
      name: 'Audi 1',
      slug: 'audi-1',
    });
    expect(result).toEqual({
      id: 'screen-1',
      theatreId: 'theatre-1',
      name: 'Audi 1',
      slug: 'audi-1',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  });

  it('throws NotFoundError when the theatre does not exist', async () => {
    theatreRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ theatreId: 'missing', name: 'Audi 1', actor }),
    ).rejects.toThrow(NotFoundError);
    expect(screenRepository.create).not.toHaveBeenCalled();
  });

  it('throws ForbiddenError when the theatre is inactive', async () => {
    theatreRepository.findById.mockResolvedValue({ id: 'theatre-1', isActive: false } as Theatre);

    await expect(
      useCase.execute({ theatreId: 'theatre-1', name: 'Audi 1', actor }),
    ).rejects.toThrow(ForbiddenError);
    expect(screenRepository.create).not.toHaveBeenCalled();
  });

  it('throws ForbiddenError when the admin is not assigned to the theatre', async () => {
    accessPolicy.canManage.mockResolvedValue(false);

    await expect(
      useCase.execute({ theatreId: 'theatre-1', name: 'Audi 1', actor }),
    ).rejects.toThrow('You are not assigned to manage this theatre');
    expect(accessPolicy.canManage).toHaveBeenCalledWith(actor, 'theatre-1');
    expect(screenRepository.create).not.toHaveBeenCalled();
  });

  it('throws ConflictError with a name field when the name already exists', async () => {
    screenRepository.findByName.mockResolvedValue(buildScreen({ name: 'AUDI 1' }));

    const error = await useCase
      .execute({ theatreId: 'theatre-1', name: 'audi 1', actor })
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ConflictError);
    expect((error as ConflictError).details).toEqual({ field: 'name' });
    expect(screenRepository.create).not.toHaveBeenCalled();
  });

  it('throws ConflictError naming the clashing screen when the slug already exists', async () => {
    screenRepository.findBySlug.mockResolvedValue(buildScreen({ name: 'Audi 1', slug: 'audi-1' }));

    await expect(
      useCase.execute({ theatreId: 'theatre-1', name: 'Audi-1', actor }),
    ).rejects.toThrow('Screen name is too similar to the existing screen "Audi 1"');
    expect(screenRepository.create).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the name produces an empty slug', async () => {
    await expect(
      useCase.execute({ theatreId: 'theatre-1', name: '!!!', actor }),
    ).rejects.toThrow(BadRequestError);
    expect(screenRepository.create).not.toHaveBeenCalled();
  });
});

